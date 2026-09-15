// Vercel Serverless Function: /api/complaints
const CLOUD_MASTER_ID = 'ff808181a09d98f701a0a3d21ac20bdb';
const CLOUD_MASTER_URL = `https://api.restful-api.dev/objects/${CLOUD_MASTER_ID}`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
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
      const response = await fetch(CLOUD_MASTER_URL);
      if (response.ok) {
        const doc = await response.json();
        const complaints = doc?.data?.complaints || [];
        return res.status(200).json(complaints);
      }
      return res.status(200).json([]);
    }

    // 2. POST /api/complaints
    if (req.method === 'POST') {
      const newComplaint = req.body;
      if (!newComplaint || !newComplaint.title || !newComplaint.description) {
        return res.status(400).json({ error: 'Complaint title and description are required.' });
      }

      // Fetch current store
      const response = await fetch(CLOUD_MASTER_URL);
      let currentDoc = {};
      if (response.ok) {
        currentDoc = await response.json();
      }

      const existingComplaints = currentDoc?.data?.complaints || [];
      const existingUsers = currentDoc?.data?.users || [];
      const updatedComplaints = [newComplaint, ...existingComplaints.filter(c => c.id !== newComplaint.id)];

      // Persist to master
      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints: updatedComplaints,
            users: existingUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });

      return res.status(201).json(newComplaint);
    }

    // 3. PATCH /api/complaints
    if (req.method === 'PATCH') {
      const { id, updates } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Complaint ID is required for update.' });
      }

      const response = await fetch(CLOUD_MASTER_URL);
      let currentDoc = {};
      if (response.ok) {
        currentDoc = await response.json();
      }

      const existingComplaints = currentDoc?.data?.complaints || [];
      const existingUsers = currentDoc?.data?.users || [];

      const updatedComplaints = existingComplaints.map(c => {
        if (c.id === id) {
          return { ...c, ...updates, updatedAt: new Date().toISOString() };
        }
        return c;
      });

      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints: updatedComplaints,
            users: existingUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });

      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Serverless complaints API error:', error);
    return res.status(500).json({ error: 'Internal database error', details: error.message });
  }
}
