// Backend Unified Persistent Database Adapter
// Compatible with Vercel Serverless Functions, Upstash Redis / Vercel KV, and local Node development.
import fs from 'node:fs';
import path from 'node:path';

// Local database file path (used during development & CLI scripts)
const LOCAL_DATA_DIR = path.resolve(process.cwd(), '.data');
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, 'fixora_db.json');

// Default initial campus complaints for fresh database initialization
const INITIAL_COMPLAINTS = [
  {
    id: 'FX-2026-001',
    title: 'Broken classroom ceiling fan making loud screeching noise',
    description: 'The ceiling fan in the middle row of Room 204 has a wobbly bearing and emits a high-pitched screeching noise. It shakes visibly when turned to speed 3 or above, making it dangerous for students sitting underneath.',
    category: 'Classroom',
    assignedDepartment: 'Electrical',
    location: 'Academic Block A, Room 204',
    coordinates: null,
    priority: 'Medium',
    status: 'Assigned',
    reportedBy: {
      id: 'stu_aditya_verma',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)',
      studentId: 'CS-2023-042'
    },
    createdAt: '2026-09-12T09:30:00.000Z',
    updatedAt: '2026-09-12T11:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Damaged bearing in middle ceiling fan posing noise disruption and safety hazard.',
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Complaint submitted by Aditya Verma via student portal.',
        timestamp: '2026-09-12T09:30:00.000Z',
        actor: 'Aditya Verma',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Triaged by Admin',
        description: 'Prioritized as Medium risk due to mechanical shaking.',
        timestamp: '2026-09-12T10:05:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Dispatched to Electrical Department',
        description: 'Assigned to Electrical maintenance team. Technician scheduled for replacement.',
        timestamp: '2026-09-12T11:15:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      }
    ],
    updates: [
      {
        id: 'up-1',
        sender: 'Campus Admin',
        role: 'Administrator',
        message: 'Electrical team has been alerted. Work order #EO-4481 created.',
        timestamp: '2026-09-12T11:16:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-002',
    title: 'Severe water leakage from 3rd floor washroom ceiling',
    description: 'Water is dripping continuously from the false ceiling in Hostel 3 corridor outside Room 312. Water has pooled on the floor creating a severe slip hazard and is seeping into the electrical conduit nearby.',
    category: 'Hostel',
    assignedDepartment: 'Hostel',
    location: 'Hostel 3, Block C, 3rd Floor Corridor',
    coordinates: { lat: 28.5451, lng: 77.1925, accuracy: 8 },
    priority: 'Critical',
    status: 'In Progress',
    reportedBy: {
      id: 'stu_rohan_gupta',
      name: 'Rohan Gupta',
      email: 'rohan.g@campus.edu',
      role: 'Student (ME-2022-019)',
      studentId: 'ME-2022-019'
    },
    createdAt: '2026-09-13T06:45:00.000Z',
    updatedAt: '2026-09-13T08:10:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Critical plumbing pipe burst above corridor ceiling threatening electrical conduit.',
    timeline: [
      {
        status: 'Submitted',
        title: 'Emergency Complaint Logged',
        description: 'High risk flagged by AI Urgency detector. (GPS Verified: 28.5451, 77.1925)',
        timestamp: '2026-09-13T06:45:00.000Z',
        actor: 'Rohan Gupta',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Priority Escalated',
        description: 'Admin verified immediate danger due to electrical conduit proximity.',
        timestamp: '2026-09-13T07:00:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Routed to Hostel Plumbers',
        description: 'Urgent task dispatched to Hostel Warden maintenance squad.',
        timestamp: '2026-09-13T07:15:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Plumbing Team on Site',
        description: 'Main valve shut off. Plumbers replacing cracked PVC junction.',
        timestamp: '2026-09-13T08:10:00.000Z',
        actor: 'Campus Maintenance',
        actorRole: 'Staff'
      }
    ],
    updates: [
      {
        id: 'up-2',
        sender: 'Campus Admin',
        role: 'Administrator',
        message: 'Floor cordoned off. Main overhead valve isolated. Replacement pipe being fitted now.',
        timestamp: '2026-09-13T08:10:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-003',
    title: 'Central Library Wi-Fi disconnected across 2nd floor reading hall',
    description: 'The campus wireless SSID "Campus_Secure_5G" is not issuing IP addresses in the 2nd floor quiet reading hall. Around 80 students preparing for mid-term exams cannot access research portals or lecture videos.',
    category: 'IT / Internet',
    assignedDepartment: 'IT / Internet',
    location: 'Central Library, 2nd Floor Reading Hall',
    coordinates: null,
    priority: 'High',
    status: 'Under Review',
    reportedBy: {
      id: 'stu_aditya_verma',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)',
      studentId: 'CS-2023-042'
    },
    createdAt: '2026-09-13T09:10:00.000Z',
    updatedAt: '2026-09-13T09:40:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'DHCP IP pool exhaustion or AP failure in Library 2nd floor reading zone.',
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Submitted with exam preparation urgency.',
        timestamp: '2026-09-13T09:10:00.000Z',
        actor: 'Aditya Verma',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Reviewing Network Logs',
        description: 'Network operations center pinging Cisco AP-LIB-02.',
        timestamp: '2026-09-13T09:40:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      }
    ],
    updates: []
  },
  {
    id: 'FX-2026-004',
    title: 'Street light pole flickering and sparking near South Gate',
    description: 'Pole #L-18 near South Campus Gate 2 has loose wiring causing electrical sparks whenever evening winds blow. Pedestrian shock risk.',
    category: 'Electrical',
    assignedDepartment: 'Electrical',
    location: 'South Campus Perimeter Road, Gate 2',
    coordinates: { lat: 28.5432, lng: 77.1911, accuracy: 12 },
    priority: 'Critical',
    status: 'Resolved',
    reportedBy: {
      id: 'stu_ananya_roy',
      name: 'Ananya Roy',
      email: 'ananya.r@campus.edu',
      role: 'Student (BT-2023-011)',
      studentId: 'BT-2023-011'
    },
    createdAt: '2026-09-11T18:30:00.000Z',
    updatedAt: '2026-09-12T09:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Loose wiring causing live sparks in outdoor streetlight fixture.',
    satisfactionRating: 5,
    resolutionFeedback: 'Resolved very swiftly! New insulated weatherproof junction box installed.',
    timeline: [
      {
        status: 'Submitted',
        title: 'Critical Safety Hazard Reported',
        description: 'Student notified safety desk of sparking light pole.',
        timestamp: '2026-09-11T18:30:00.000Z',
        actor: 'Ananya Roy',
        actorRole: 'Student'
      },
      {
        status: 'Assigned',
        title: 'Emergency Team Dispatched',
        description: 'Electrical patrol dispatched.',
        timestamp: '2026-09-11T18:45:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Circuit Cutoff & Repair',
        description: 'Isolator opened. Damaged weatherized cable being replaced.',
        timestamp: '2026-09-11T19:10:00.000Z',
        actor: 'Campus Maintenance',
        actorRole: 'Staff'
      },
      {
        status: 'Resolved',
        title: 'Fully Repaired & Tested',
        description: 'Replaced faulty waterproof junction box, re-wired connection, and tested illumination under load.',
        timestamp: '2026-09-12T09:15:00.000Z',
        actor: 'Campus Admin',
        actorRole: 'Admin'
      }
    ],
    updates: [
      {
        id: 'up-4',
        sender: 'Campus Admin',
        role: 'Administrator',
        message: 'Fixed and sealed with IP67 weatherproof junction casing. Fully safe for pedestrians.',
        timestamp: '2026-09-12T09:15:00.000Z'
      }
    ]
  }
];

// In-memory runtime cache
let memoryStore = {
  complaints: [...INITIAL_COMPLAINTS],
  users: [],
  admins: [],
  lastUpdated: new Date().toISOString()
};

// Helper: Ensure local directory exists
function ensureLocalDir() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
  } catch (e) {}
}

// Helper: Load from local disk file if exists
function readLocalFile() {
  ensureLocalDir();
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Error reading local db file:', e.message);
  }
  return null;
}

// Helper: Write to local disk file
function writeLocalFile(data) {
  ensureLocalDir();
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local db file:', e.message);
  }
}

// Helper: Check Upstash Redis / Vercel KV configuration
function getUpstashConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url: url.replace(/\/$/, ''), token };
  }
  return null;
}

// Upstash REST fetch
async function upstashCommand(cmd, ...args) {
  const config = getUpstashConfig();
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/${cmd}/${args.map(encodeURIComponent).join('/')}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.result;
    }
  } catch (e) {
    console.warn('Upstash Redis request failed:', e.message);
  }
  return null;
}

export const db = {
  // Load entire database state
  async load() {
    // 1. Check Upstash / Vercel KV if configured in environment
    const upstash = getUpstashConfig();
    if (upstash) {
      try {
        const raw = await upstashCommand('get', 'fixora_master_db');
        if (raw) {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (parsed && Array.isArray(parsed.complaints)) {
            memoryStore = parsed;
            return memoryStore;
          }
        }
      } catch (e) {
        console.warn('Could not read from Upstash KV:', e.message);
      }
    }

    // 2. Check local file (development / CLI)
    const local = readLocalFile();
    if (local && Array.isArray(local.complaints)) {
      memoryStore = local;
      return memoryStore;
    }

    // 3. Fall back to memory store initialized with seed data
    return memoryStore;
  },

  // Save entire database state
  async save(data) {
    memoryStore = {
      ...data,
      lastUpdated: new Date().toISOString()
    };

    // 1. Write to Upstash / Vercel KV if configured
    const upstash = getUpstashConfig();
    if (upstash) {
      try {
        const payload = JSON.stringify(memoryStore);
        await fetch(`${upstash.url}/set/fixora_master_db`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${upstash.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Could not save to Upstash KV:', e.message);
      }
    }

    // 2. Write to local file
    writeLocalFile(memoryStore);

    return memoryStore;
  },

  // Complaints CRUD
  async getComplaints() {
    const store = await this.load();
    return store.complaints || [];
  },

  async addComplaint(complaint) {
    const store = await this.load();
    const existing = store.complaints || [];
    const updated = [complaint, ...existing.filter(c => c.id !== complaint.id)];
    await this.save({ ...store, complaints: updated });
    return complaint;
  },

  async updateComplaint(id, updates) {
    const store = await this.load();
    const existing = store.complaints || [];
    let modified = null;

    const updated = existing.map(c => {
      if (c.id === id) {
        modified = {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return modified;
      }
      return c;
    });

    if (modified) {
      await this.save({ ...store, complaints: updated });
    }
    return modified;
  },

  // Users CRUD
  async getUsers() {
    const store = await this.load();
    return store.users || [];
  },

  async addUser(user) {
    const store = await this.load();
    const existing = store.users || [];
    const updated = [...existing.filter(u => u.id !== user.id && u.email !== user.email), user];
    await this.save({ ...store, users: updated });
    return user;
  },

  // Admins CRUD
  async getAdmins() {
    const store = await this.load();
    return store.admins || [];
  },

  async setAdmin(adminAccount) {
    const store = await this.load();
    const existing = store.admins || [];
    const cleanEmail = adminAccount.email.trim().toLowerCase();
    const updated = [
      adminAccount,
      ...existing.filter(a => a.email.toLowerCase() !== cleanEmail)
    ];
    await this.save({ ...store, admins: updated });
    return adminAccount;
  }
};
