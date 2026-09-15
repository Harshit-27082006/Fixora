// Vercel Serverless Function: /api/auth
import crypto from 'node:crypto';
import { db } from './db.js';

// Cryptographic hash helper for passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password).trim()).digest('hex');
}

function verifyPassword(inputPassword, storedHashOrPlain) {
  if (!inputPassword || !storedHashOrPlain) return false;
  const cleanInput = String(inputPassword).trim();
  const inputHash = hashPassword(cleanInput);
  return cleanInput === storedHashOrPlain || inputHash === storedHashOrPlain;
}

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  try {
    // 1. REGISTER STUDENT ACCOUNT (Only students can publicly register)
    if (action === 'register' && req.method === 'POST') {
      const { fullName, studentId, email, password } = req.body || {};

      if (!fullName || !studentId || !email || !password) {
        return res.status(400).json({ error: 'All fields (Full Name, Student ID, Email, Password) are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanStudentId = studentId.trim().toUpperCase();

      // Prohibit administrative registration spoofing
      if (
        cleanEmail.includes('admin') ||
        cleanEmail.includes('provost') ||
        cleanEmail.includes('dean') ||
        cleanEmail.includes('registrar')
      ) {
        return res.status(403).json({ error: 'Public registration for administrative accounts is strictly prohibited.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const existingUsers = await db.getUsers();

      // Check duplicates
      const duplicate = existingUsers.some(u => 
        u.email.toLowerCase() === cleanEmail || 
        (u.studentId && u.studentId.toUpperCase() === cleanStudentId)
      );

      if (duplicate) {
        return res.status(409).json({ error: 'An account with this Email or Student ID already exists. Please sign in.' });
      }

      const newStudent = {
        id: `stu_${Date.now()}`,
        name: fullName.trim(),
        email: cleanEmail,
        studentId: cleanStudentId,
        rollNumber: cleanStudentId,
        role: 'student',
        department: 'Enrolled Campus Student',
        hostel: 'Campus Resident',
        phone: '+91 98000 00000',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}&backgroundColor=4f46e5`,
        passwordHash: hashPassword(password),
        joinedDate: new Date().toISOString().split('T')[0]
      };

      await db.addUser(newStudent);

      // Return sanitized user object (never return password/hash)
      const { passwordHash: _, ...safeUser } = newStudent;
      return res.status(201).json({
        success: true,
        user: { ...safeUser, authenticatedRole: 'student', sessionToken: `stu_sess_${Date.now()}` }
      });
    }

    // 2. LOGIN AUTHENTICATION (Verified by backend role & credentials)
    if (action === 'login' && req.method === 'POST') {
      const { role, identifier, password } = req.body || {};

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Please enter both User ID/Email and password.' });
      }

      const cleanId = String(identifier).trim().toLowerCase();

      // ADMIN AUTHENTICATION
      if (role === 'admin') {
        // A. Check environment variables configured by developer/owner
        const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        const envAdminPassword = process.env.ADMIN_PASSWORD || '';
        const envAdminHash = process.env.ADMIN_PASSWORD_HASH || '';

        let authenticatedAdmin = null;

        if (envAdminEmail && cleanId === envAdminEmail) {
          const match = envAdminHash
            ? verifyPassword(password, envAdminHash)
            : (envAdminPassword && verifyPassword(password, envAdminPassword));

          if (match) {
            authenticatedAdmin = {
              id: 'admin_primary_owner',
              name: process.env.ADMIN_NAME || 'Campus Administrator',
              email: envAdminEmail,
              role: 'admin',
              designation: 'Campus Operations Director & Developer',
              department: 'Central Administration',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              phone: '+91 98100 00000',
              joinedDate: '2024-01-01'
            };
          }
        }

        // B. Check persistent database admins configured via setup-admin script
        if (!authenticatedAdmin) {
          const dbAdmins = await db.getAdmins();
          const found = dbAdmins.find(a => 
            a.email.toLowerCase() === cleanId || 
            (a.username && a.username.toLowerCase() === cleanId)
          );

          if (found && verifyPassword(password, found.passwordHash)) {
            authenticatedAdmin = {
              id: found.id || `admin_${Date.now()}`,
              name: found.name || 'Campus Administrator',
              email: found.email,
              role: 'admin',
              designation: found.designation || 'Campus Operations Director',
              department: 'Central Administration',
              avatar: found.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              phone: found.phone || '+91 98101 23456',
              joinedDate: found.joinedDate || new Date().toISOString().split('T')[0]
            };
          }
        }

        if (!authenticatedAdmin) {
          return res.status(401).json({
            error: 'Access Denied: Invalid Administrator email or password. Please verify your authorized credentials.'
          });
        }

        return res.status(200).json({
          success: true,
          user: {
            ...authenticatedAdmin,
            authenticatedRole: 'admin',
            sessionToken: `adm_jwt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
          }
        });
      }

      // STUDENT AUTHENTICATION
      const users = await db.getUsers();
      const student = users.find(u => 
        u.email.toLowerCase() === cleanId || 
        (u.studentId && u.studentId.toLowerCase() === cleanId) ||
        (u.rollNumber && u.rollNumber.toLowerCase() === cleanId)
      );

      if (!student) {
        return res.status(404).json({
          error: 'Student account not found. Please click "Create New Account" below to register.'
        });
      }

      const passwordMatch = verifyPassword(password, student.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password for this student account.' });
      }

      // Return sanitized student user
      const { passwordHash: _, ...safeStudent } = student;
      return res.status(200).json({
        success: true,
        user: {
          ...safeStudent,
          authenticatedRole: 'student',
          sessionToken: `stu_jwt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
        }
      });
    }

    return res.status(400).json({ error: 'Invalid authentication action specified.' });
  } catch (error) {
    console.error('Serverless auth API error:', error);
    return res.status(500).json({ error: 'Authentication service failure', details: error.message });
  }
}
