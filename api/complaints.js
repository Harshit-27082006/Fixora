// Vercel Serverless Function: /api/complaints
import { db } from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. GET /api/complaints
    if (req.method === 'GET') {
      const complaints = await db.getComplaints();
      return res.status(200).json(complaints);
    }

    // 2. POST /api/complaints (Record new student complaint)
    if (req.method === 'POST') {
      const newComplaint = req.body;
      if (!newComplaint || !newComplaint.title || !newComplaint.description) {
        return res.status(400).json({ error: 'Complaint title and description are required.' });
      }

      const saved = await db.addComplaint(newComplaint);
      return res.status(201).json(saved);
    }

    // 3. PATCH /api/complaints (Admin dispatch, status, priority, or reply update)
    if (req.method === 'PATCH') {
      const { id, updates } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Complaint ID is required for update.' });
      }

      const updated = await db.updateComplaint(id, updates);
      if (!updated) {
        return res.status(404).json({ error: `Complaint with ID ${id} not found.` });
      }

      return res.status(200).json({ success: true, complaint: updated });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Serverless complaints API error:', error);
    return res.status(500).json({ error: 'Internal database error', details: error.message });
  }
}
