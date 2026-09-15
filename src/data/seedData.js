export const DEPARTMENTS = [
  { id: 'Electrical', name: 'Electrical', icon: 'Zap', lead: 'Rajesh Rao', email: 'electrical@campus.edu' },
  { id: 'IT / Internet', name: 'IT / Internet', icon: 'Wifi', lead: 'Priya Patel', email: 'it.helpdesk@campus.edu' },
  { id: 'Hostel', name: 'Hostel', icon: 'Home', lead: 'Ramesh Kumar', email: 'hostel.warden@campus.edu' },
  { id: 'Cleanliness', name: 'Cleanliness', icon: 'Sparkles', lead: 'Anita Singh', email: 'sanitation@campus.edu' },
  { id: 'Transport', name: 'Transport', icon: 'Bus', lead: 'Manoj Verma', email: 'transport@campus.edu' },
  { id: 'Laboratory', name: 'Laboratory', icon: 'FlaskConical', lead: 'Dr. Arvind Joshi', email: 'lab.coordinator@campus.edu' },
  { id: 'Classroom', name: 'Classroom', icon: 'GraduationCap', lead: 'Sanjay Deshmukh', email: 'academic.facilities@campus.edu' },
  { id: 'Maintenance', name: 'Maintenance', icon: 'Wrench', lead: 'Suresh Nair', email: 'campus.maintenance@campus.edu' },
  { id: 'Other', name: 'Other Facilities', icon: 'HelpCircle', lead: 'Helpdesk Officer', email: 'general.desk@campus.edu' }
];

export const CATEGORIES = [
  'Electrical',
  'IT / Internet',
  'Hostel',
  'Cleanliness',
  'Transport',
  'Laboratory',
  'Classroom',
  'Maintenance',
  'Other'
];

export const PRIORITIES = [
  { label: 'Low', value: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', sla: '48 Hours' },
  { label: 'Medium', value: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', sla: '24 Hours' },
  { label: 'High', value: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', sla: '8 Hours' },
  { label: 'Critical', value: 'Critical', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', sla: '2 Hours' }
];

export const STATUS_STEPS = [
  { id: 'Submitted', label: 'Submitted', description: 'Complaint logged and queued for validation' },
  { id: 'Under Review', label: 'Under Review', description: 'Admin assessing urgency and categorizing' },
  { id: 'Assigned', label: 'Assigned', description: 'Dispatched to responsible department' },
  { id: 'In Progress', label: 'In Progress', description: 'Department personnel actively working on fix' },
  { id: 'Resolved', label: 'Resolved', description: 'Issue rectified and verified' },
  { id: 'Closed', label: 'Closed', description: 'Complaint finalized and closed by administration' }
];

export const USERS = [
  {
    id: 'user_student_1',
    role: 'student',
    name: 'Aditya Verma',
    email: 'aditya.verma@campus.edu',
    phone: '+91 98765 43210',
    department: 'B.Tech Computer Science',
    rollNumber: 'CS-2023-042',
    hostel: 'Hostel 3, Room B-214',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_admin_1',
    role: 'admin',
    name: 'Dr. Sunita Mehra',
    email: 'dean.admin@campus.edu',
    phone: '+91 98112 33445',
    designation: 'Dean of Campus Operations',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_dept_elec',
    role: 'department',
    departmentId: 'Electrical',
    name: 'Rajesh Rao',
    email: 'rajesh.electrical@campus.edu',
    phone: '+91 98450 11223',
    designation: 'Senior Electrical Engineer',
    department: 'Electrical Department',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_dept_it',
    role: 'department',
    departmentId: 'IT / Internet',
    name: 'Priya Patel',
    email: 'priya.it@campus.edu',
    phone: '+91 99234 55667',
    designation: 'Campus Network Lead',
    department: 'IT / Internet',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_dept_hostel',
    role: 'department',
    departmentId: 'Hostel',
    name: 'Ramesh Kumar',
    email: 'ramesh.hostel@campus.edu',
    phone: '+91 97321 88990',
    designation: 'Chief Hostel Warden',
    department: 'Hostel Administration',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: 'FX-2026-001',
    title: 'Broken classroom ceiling fan making loud screeching noise',
    description: 'The ceiling fan in the middle row of Room 204 has a wobbly bearing and emits a high-pitched screeching noise. It shakes visibly when turned to speed 3 or above, making it dangerous for students sitting underneath.',
    category: 'Classroom',
    assignedDepartment: 'Electrical',
    location: 'Academic Block A, Room 204',
    priority: 'Medium',
    status: 'Assigned',
    reportedBy: {
      id: 'user_student_1',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)'
    },
    createdAt: '2026-09-12T09:30:00.000Z',
    updatedAt: '2026-09-12T11:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Damaged bearing in middle ceiling fan posing noise disruption and safety hazard.',
    aiConfidence: 0.94,
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
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Dispatched to Electrical Department',
        description: 'Assigned to Rajesh Rao (Electrical maintenance team). Technician scheduled for replacement.',
        timestamp: '2026-09-12T11:15:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      }
    ],
    updates: [
      {
        id: 'up-1',
        sender: 'Dr. Sunita Mehra',
        role: 'Admin',
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
    priority: 'Critical',
    status: 'In Progress',
    reportedBy: {
      id: 'user_student_2',
      name: 'Rohan Gupta',
      email: 'rohan.g@campus.edu',
      role: 'Student (ME-2022-019)'
    },
    createdAt: '2026-09-13T06:45:00.000Z',
    updatedAt: '2026-09-13T08:10:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Critical plumbing pipe burst above corridor ceiling threatening electrical conduit.',
    aiConfidence: 0.98,
    timeline: [
      {
        status: 'Submitted',
        title: 'Emergency Complaint Logged',
        description: 'High risk flagged by AI Urgency detector.',
        timestamp: '2026-09-13T06:45:00.000Z',
        actor: 'Rohan Gupta',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Priority Escalated',
        description: 'Admin verified immediate danger due to electrical proximity.',
        timestamp: '2026-09-13T07:00:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Routed to Hostel Plumbers',
        description: 'Urgent task dispatched to Ramesh Kumar (Hostel Warden team).',
        timestamp: '2026-09-13T07:15:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Plumbing Team on Site',
        description: 'Main valve shut off. Plumbers replacing cracked PVC junction.',
        timestamp: '2026-09-13T08:10:00.000Z',
        actor: 'Ramesh Kumar',
        actorRole: 'Department'
      }
    ],
    updates: [
      {
        id: 'up-2',
        sender: 'Ramesh Kumar',
        role: 'Hostel Staff',
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
    priority: 'High',
    status: 'Under Review',
    reportedBy: {
      id: 'user_student_1',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)'
    },
    createdAt: '2026-09-13T09:10:00.000Z',
    updatedAt: '2026-09-13T09:40:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'DHCP IP pool exhaustion or AP failure in Library 2nd floor reading zone.',
    aiConfidence: 0.96,
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
        actor: 'Priya Patel',
        actorRole: 'IT Dept'
      }
    ],
    updates: []
  },
  {
    id: 'FX-2026-004',
    title: 'Spectrophotometer calibration error in Biochemistry Lab',
    description: 'Spectrophotometer Unit #3 in Biochemistry Lab displays Err-04 (baseline reference drift). Students are getting skewed absorbance curves for their enzymology practical assessments.',
    category: 'Laboratory',
    assignedDepartment: 'Laboratory',
    location: 'Science Block, Lab 4 (Biochemistry)',
    priority: 'Medium',
    status: 'Submitted',
    reportedBy: {
      id: 'user_staff_1',
      name: 'Dr. Meenakshi Rao',
      email: 'meenakshi.bio@campus.edu',
      role: 'Lab Assistant'
    },
    createdAt: '2026-09-13T10:05:00.000Z',
    updatedAt: '2026-09-13T10:05:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Biochemistry laboratory instrument optical sensor requires recalibration.',
    aiConfidence: 0.91,
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Recorded for lab equipment maintenance inspection.',
        timestamp: '2026-09-13T10:05:00.000Z',
        actor: 'Dr. Meenakshi Rao',
        actorRole: 'Staff'
      }
    ],
    updates: []
  },
  {
    id: 'FX-2026-005',
    title: 'Ground floor main academic block washroom taps running dry',
    description: 'Both washrooms in the west wing of Academic Block Ground Floor have zero water pressure. Taps and flush tanks are dry since morning, causing significant hygiene concerns.',
    category: 'Cleanliness',
    assignedDepartment: 'Cleanliness',
    location: 'Academic Block, Ground Floor West Wing',
    priority: 'High',
    status: 'In Progress',
    reportedBy: {
      id: 'user_student_3',
      name: 'Kavita Menon',
      email: 'kavita.m@campus.edu',
      role: 'Student (EE-2024-008)'
    },
    createdAt: '2026-09-13T07:20:00.000Z',
    updatedAt: '2026-09-13T09:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Water supply interruption to ground floor sanitation facilities.',
    aiConfidence: 0.95,
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Hygiene complaint submitted by student.',
        timestamp: '2026-09-13T07:20:00.000Z',
        actor: 'Kavita Menon',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Sanitation Inspection',
        description: 'Admin checked ground floor booster pump status.',
        timestamp: '2026-09-13T08:00:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Assigned to Sanitation & Plumbing',
        description: 'Dispatched to Anita Singh.',
        timestamp: '2026-09-13T08:15:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Motor Pump Reset',
        description: 'Auxiliary motor switched on. Water overhead tanks filling up.',
        timestamp: '2026-09-13T09:00:00.000Z',
        actor: 'Anita Singh',
        actorRole: 'Cleanliness Lead'
      }
    ],
    updates: [
      {
        id: 'up-5',
        sender: 'Anita Singh',
        role: 'Cleanliness Supervisor',
        message: 'Tripped motor breaker reset. Overhead tank will achieve working pressure in 30 minutes.',
        timestamp: '2026-09-13T09:00:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-006',
    title: 'Street light pole flickering and sparking near Girls Hostel gate',
    description: 'Pole #L-18 near South Campus Gate 2 has a short circuit causing intense electrical sparks whenever the evening winds blow. It creates a critical fire and pedestrian shock risk.',
    category: 'Electrical',
    assignedDepartment: 'Electrical',
    location: 'South Campus Perimeter Road, Gate 2',
    priority: 'Critical',
    status: 'Resolved',
    reportedBy: {
      id: 'user_student_4',
      name: 'Ananya Roy',
      email: 'ananya.r@campus.edu',
      role: 'Student (BT-2023-011)'
    },
    createdAt: '2026-09-11T18:30:00.000Z',
    updatedAt: '2026-09-12T09:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Loose wiring causing live sparks in outdoor streetlight fixture.',
    aiConfidence: 0.99,
    satisfactionRating: 5,
    resolutionFeedback: 'Resolved very swiftly! New insulated junction box installed.',
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
        status: 'Under Review',
        title: 'Emergency Review',
        description: 'Admin immediately dispatched electrical patrol.',
        timestamp: '2026-09-11T18:40:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Emergency Team Dispatched',
        description: 'Rajesh Rao and on-duty technician alerted.',
        timestamp: '2026-09-11T18:45:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Circuit Cutoff & Repair',
        description: 'Isolator opened. Damaged weatherized cable being replaced.',
        timestamp: '2026-09-11T19:10:00.000Z',
        actor: 'Rajesh Rao',
        actorRole: 'Electrical Dept'
      },
      {
        status: 'Resolved',
        title: 'Fully Repaired & Tested',
        description: 'Replaced faulty waterproof junction box, re-wired connection, and tested illumination under load.',
        timestamp: '2026-09-12T09:15:00.000Z',
        actor: 'Rajesh Rao',
        actorRole: 'Electrical Dept'
      }
    ],
    updates: [
      {
        id: 'up-6',
        sender: 'Rajesh Rao',
        role: 'Electrical Dept',
        message: 'Fixed and sealed with IP67 weatherproof junction casing. Fully safe for pedestrians.',
        timestamp: '2026-09-12T09:15:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-007',
    title: 'Route 7 college bus arriving 45 minutes late regularly',
    description: 'Bus #7 from North Suburbs has arrived after 9:15 AM for 4 days this week, causing over 35 students to be marked late for 8:30 AM first-period lectures.',
    category: 'Transport',
    assignedDepartment: 'Transport',
    location: 'Bus Bay 4 / North Suburb Route',
    priority: 'Medium',
    status: 'Assigned',
    reportedBy: {
      id: 'user_student_1',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)'
    },
    createdAt: '2026-09-12T14:20:00.000Z',
    updatedAt: '2026-09-12T16:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Consistent route schedule delay impacting morning academic attendance.',
    aiConfidence: 0.93,
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Student reported persistent delay on bus route 7.',
        timestamp: '2026-09-12T14:20:00.000Z',
        actor: 'Aditya Verma',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Route Audit Initiated',
        description: 'Transport office reviewing GPS route logs.',
        timestamp: '2026-09-12T15:30:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Assigned to Transport Officer',
        description: 'Manoj Verma evaluating detour due to metro construction.',
        timestamp: '2026-09-12T16:00:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      }
    ],
    updates: [
      {
        id: 'up-7',
        sender: 'Manoj Verma',
        role: 'Transport Officer',
        message: 'Metro construction on Ring Road caused severe bottlenecks. Shifting departure time 20 mins earlier from Monday.',
        timestamp: '2026-09-12T16:05:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-008',
    title: 'Classroom 401 overhead projector bulb burnt out',
    description: 'During today’s thermodynamics lecture, the ceiling projector died with a loud pop and blinking red LED. Faculty was unable to display presentation slides.',
    category: 'Classroom',
    assignedDepartment: 'Classroom',
    location: 'Engineering Block 2, Room 401',
    priority: 'Low',
    status: 'Resolved',
    reportedBy: {
      id: 'user_staff_2',
      name: 'Prof. Vikrant Sood',
      email: 'vikrant.mech@campus.edu',
      role: 'Faculty'
    },
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-09-11T14:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Blown projector lamp requires replacement and optical lens cleaning.',
    aiConfidence: 0.96,
    satisfactionRating: 4,
    resolutionFeedback: 'Bulb replaced by afternoon, lecture continued smoothly next day.',
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Faculty reported projector bulb failure.',
        timestamp: '2026-09-10T11:00:00.000Z',
        actor: 'Prof. Vikrant Sood',
        actorRole: 'Faculty'
      },
      {
        status: 'Under Review',
        title: 'Inventory Checked',
        description: 'Spare Epson lamp confirmed in media store.',
        timestamp: '2026-09-10T11:30:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Assigned to Classroom AV Tech',
        description: 'Sanjay Deshmukh assigned.',
        timestamp: '2026-09-10T11:45:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Lamp Assembly Replaced',
        description: 'Technician installing replacement bulb and resetting runtime timer.',
        timestamp: '2026-09-10T14:15:00.000Z',
        actor: 'Sanjay Deshmukh',
        actorRole: 'Classroom Lead'
      },
      {
        status: 'Resolved',
        title: 'Tested and Closed',
        description: 'Display calibrated, HDMI and wireless casting verified.',
        timestamp: '2026-09-11T14:00:00.000Z',
        actor: 'Sanjay Deshmukh',
        actorRole: 'Classroom Lead'
      }
    ],
    updates: []
  },
  {
    id: 'FX-2026-009',
    title: 'AC failure during summer exam preparation in Reading Hall',
    description: 'The split AC unit #2 in PG Reading Hall is blowing ambient warm air and producing a rattling noise. The room temperature is exceeding 34°C.',
    category: 'Maintenance',
    assignedDepartment: 'Maintenance',
    location: 'PG Reading Hall, Central Library 3rd Floor',
    priority: 'High',
    status: 'In Progress',
    reportedBy: {
      id: 'user_student_1',
      name: 'Aditya Verma',
      email: 'aditya.verma@campus.edu',
      role: 'Student (CS-2023-042)'
    },
    createdAt: '2026-09-13T08:20:00.000Z',
    updatedAt: '2026-09-13T10:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Refrigerant leak or compressor trip on PG Library split AC unit.',
    aiConfidence: 0.94,
    timeline: [
      {
        status: 'Submitted',
        title: 'Complaint Logged',
        description: 'Reading hall thermal comfort complaint logged.',
        timestamp: '2026-09-13T08:20:00.000Z',
        actor: 'Aditya Verma',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Maintenance Notified',
        description: 'Suresh Nair dispatched HVAC contractor.',
        timestamp: '2026-09-13T09:00:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'HVAC Work Order Issued',
        description: 'Assigned to Campus Maintenance division.',
        timestamp: '2026-09-13T09:15:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'In Progress',
        title: 'Gas Refill & Filter Cleaning',
        description: 'Contractor checking for Freon leak and servicing condenser coils.',
        timestamp: '2026-09-13T10:15:00.000Z',
        actor: 'Suresh Nair',
        actorRole: 'Maintenance Lead'
      }
    ],
    updates: [
      {
        id: 'up-9',
        sender: 'Suresh Nair',
        role: 'Maintenance Lead',
        message: 'Compressor capacitor replaced; technician recharging gas now. Expect normal cooling by 12:30 PM.',
        timestamp: '2026-09-13T10:15:00.000Z'
      }
    ]
  },
  {
    id: 'FX-2026-010',
    title: 'Open electrical switchboard in corridor with exposed live wires',
    description: 'In the Engineering Block 1st floor corridor next to the elevator, the metal faceplate of the main 220V switchboard has come off. Bare wire joints are hanging out within arm reach of passing students.',
    category: 'Electrical',
    assignedDepartment: 'Electrical',
    location: 'Engineering Block, 1st Floor Corridor (near Lift B)',
    priority: 'Critical',
    status: 'Assigned',
    reportedBy: {
      id: 'user_student_5',
      name: 'Tanmay Bhatt',
      email: 'tanmay.b@campus.edu',
      role: 'Student (EC-2024-033)'
    },
    createdAt: '2026-09-13T10:25:00.000Z',
    updatedAt: '2026-09-13T10:45:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    aiSummary: 'Critical electrocution hazard: Exposed live electrical wiring in high traffic corridor.',
    aiConfidence: 0.99,
    timeline: [
      {
        status: 'Submitted',
        title: 'Critical Electrical Hazard Logged',
        description: 'AI urgency engine triggered immediate Critical rating.',
        timestamp: '2026-09-13T10:25:00.000Z',
        actor: 'Tanmay Bhatt',
        actorRole: 'Student'
      },
      {
        status: 'Under Review',
        title: 'Expedited Review',
        description: 'Admin flagged for rapid response squad.',
        timestamp: '2026-09-13T10:35:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      },
      {
        status: 'Assigned',
        title: 'Assigned to Rajesh Rao',
        description: 'Electrician dispatched with emergency safety enclosure.',
        timestamp: '2026-09-13T10:45:00.000Z',
        actor: 'Dr. Sunita Mehra',
        actorRole: 'Admin'
      }
    ],
    updates: []
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user_student_1',
    role: 'student',
    title: 'Work In Progress: AC Repair',
    message: 'Maintenance team is recharging refrigerant on ticket FX-2026-009 (Reading Hall AC).',
    timestamp: '2026-09-13T10:15:00.000Z',
    complaintId: 'FX-2026-009',
    read: false,
    type: 'progress'
  },
  {
    id: 'notif-2',
    userId: 'user_student_1',
    role: 'student',
    title: 'Complaint Assigned',
    message: 'Your complaint FX-2026-001 (Classroom ceiling fan) has been assigned to Electrical Department.',
    timestamp: '2026-09-12T11:15:00.000Z',
    complaintId: 'FX-2026-001',
    read: false,
    type: 'assignment'
  },
  {
    id: 'notif-3',
    userId: 'user_student_1',
    role: 'student',
    title: 'Complaint Resolved',
    message: 'Ticket FX-2026-008 (Classroom 401 projector bulb) marked Resolved by Classroom Lead.',
    timestamp: '2026-09-11T14:00:00.000Z',
    complaintId: 'FX-2026-008',
    read: true,
    type: 'resolved'
  },
  {
    id: 'notif-4',
    userId: 'user_admin_1',
    role: 'admin',
    title: 'Critical Alert: Exposed Wires',
    message: 'High risk ticket FX-2026-010 submitted in Engineering Block 1st floor corridor.',
    timestamp: '2026-09-13T10:25:00.000Z',
    complaintId: 'FX-2026-010',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-5',
    userId: 'user_dept_elec',
    role: 'department',
    title: 'New Emergency Assignment',
    message: 'Ticket FX-2026-010 assigned to Electrical Department by Admin.',
    timestamp: '2026-09-13T10:45:00.000Z',
    complaintId: 'FX-2026-010',
    read: false,
    type: 'assignment'
  }
];

export const CAMPUS_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Scheduled Electrical Grid Servicing',
    date: 'Today, 2:00 PM - 4:00 PM',
    message: 'Routine maintenance on substation transformer #2. Academic Block A backup generators will run.',
    type: 'warning'
  },
  {
    id: 'ann-2',
    title: 'Monsoon Campus Cleanliness Drive',
    date: 'Sep 14 - Sep 16',
    message: 'All hostel drain lines and rainwater harvesting pits undergo bi-weekly cleaning inspection.',
    type: 'info'
  }
];
