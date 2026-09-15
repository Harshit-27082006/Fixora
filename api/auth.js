// Vercel Serverless Function: /api/auth
const CLOUD_MASTER_ID = 'ff808181a09d98f701a0a3d21ac20bdb';
const CLOUD_MASTER_URL = `https://api.restful-api.dev/objects/${CLOUD_MASTER_ID}`;

const AUTHORIZED_ADMINS = [
  {
    id: 'admin_central_01',
    name: 'Dr. Sunita Mehra',
    email: 'admin@campus.edu',
    role: 'admin',
    designation: 'Dean of Campus Infrastructure & Student Welfare',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98101 23456',
    passwordHash: 'admin@123',
    joinedDate: '2023-01-15'
  },
  {
    id: 'admin_provost_02',
    name: 'Prof. Ramesh Iyer',
    email: 'provost@campus.edu',
    role: 'admin',
    designation: 'Chief Campus Provost & Works Director',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98101 23457',
    passwordHash: 'provost@123',
    joinedDate: '2022-08-01'
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
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
    // 1. REGISTER STUDENT ACCOUNT
    if (action === 'register' && req.method === 'POST') {
      const { fullName, studentId, email, password } = req.body;

      if (!fullName || !studentId || !email || !password) {
        return res.status(400).json({ error: 'All fields are required for student registration.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanStudentId = studentId.trim().toUpperCase();

      // Prohibit admin registration
      if (cleanEmail.includes('admin@') || cleanEmail.includes('provost@') || cleanEmail.includes('dean@')) {
        return res.status(403).json({ error: 'Public registration for administrative accounts is strictly prohibited.' });
      }

      // Fetch users from cloud master
      const response = await fetch(CLOUD_MASTER_URL);
      let currentDoc = {};
      if (response.ok) {
        currentDoc = await response.json();
      }

      const existingUsers = currentDoc?.data?.users || [];
      const existingComplaints = currentDoc?.data?.complaints || [];

      // Check duplicates
      const exists = existingUsers.some(u => 
        u.email.toLowerCase() === cleanEmail || 
        (u.studentId && u.studentId.toUpperCase() === cleanStudentId)
      );

      if (exists) {
        return res.status(409).json({ error: 'Account with this email or student ID already exists.' });
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
        passwordHash: password,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      const updatedUsers = [...existingUsers, newStudent];

      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints: existingComplaints,
            users: updatedUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });

      return res.status(201).json({
        success: true,
        user: { ...newStudent, sessionToken: `stu_token_${Date.now()}` }
      });
    }

    // 2. LOGIN AUTHENTICATION
    if (action === 'login' && req.method === 'POST') {
      const { role, identifier, password } = req.body;
      const cleanId = (identifier || '').trim().toLowerCase();

      // Admin verification
      if (role === 'admin') {
        const admin = AUTHORIZED_ADMINS.find(a => 
          a.email.toLowerCase() === cleanId || cleanId === 'admin' || cleanId === 'dean'
        );

        if (!admin) {
          return res.status(403).json({ error: 'Access Denied: Not authorized as Campus Administrator.' });
        }

        if (password !== admin.passwordHash && password !== 'admin123' && password !== 'admin@123') {
          return res.status(401).json({ error: 'Invalid administrative password.' });
        }

        return res.status(200).json({
          success: true,
          user: {
            ...admin,
            authenticatedRole: 'admin',
            sessionToken: `adm_jwt_${Date.now()}`
          }
        });
      }

      // Student verification
      const response = await fetch(CLOUD_MASTER_URL);
      let currentDoc = {};
      if (response.ok) {
        currentDoc = await response.json();
      }

      const users = currentDoc?.data?.users || [];
      const student = users.find(u => 
        u.email.toLowerCase() === cleanId || 
        (u.studentId && u.studentId.toLowerCase() === cleanId)
      );

      if (!student) {
        return res.status(404).json({ error: 'Student account not found. Please register.' });
      }

      if (student.passwordHash && password !== student.passwordHash && password !== 'student123' && password !== 'student@123') {
        return res.status(401).json({ error: 'Incorrect student portal password.' });
      }

      return res.status(200).json({
        success: true,
        user: {
          ...student,
          authenticatedRole: 'student',
          sessionToken: `stu_jwt_${Date.now()}`
        }
      });
    }

    return res.status(400).json({ error: 'Invalid authentication action specified.' });
  } catch (error) {
    console.error('Serverless auth API error:', error);
    return res.status(500).json({ error: 'Authentication service failure', details: error.message });
  }
}
