# FIXORA — Campus Complaint Management System

> **Report. Track. Resolve.**  
> Institutional grievance and facilities complaint lifecycle management system with intelligent triage.

---

## 🌟 Overview

**FIXORA** is an institutional campus issue resolution platform designed for university students, administrative directors, and facility maintenance departments. It covers classrooms, laboratories, hostels, electrical systems, internet/network infrastructure, sanitation, transport, and general campus facilities.

### Core Lifecycle Flow
```
REPORT ──> VALIDATE ──> STORE ──> ASSIGN ──> UPDATE ──> RESOLVE
```

---

## 🚀 Key Features

### 1. Professional College ERP Authentication & Role Portals
- **Institutional Single Sign-On (ERP) Gateway**: Secure college ERP portal entry screen with enrollment number / institutional User ID validation.
- **Student Portal**: Lodge campus facility issues, monitor real-time milestone timelines, receive notifications, and submit resolution feedback.
- **Campus Administration Command Center**: Central overview of all active campus complaints, priority triage, cross-department task dispatching, and SLA compliance monitoring.
- **Department Operations (9 Facilities)**: Specialized operational queue for field staff (Electrical, IT/Internet, Hostel, Cleanliness, Transport, Lab, Classroom, Maintenance, and Other) to log technician notes and verify repairs.
- **Role-Based Routing**: Strict access boundary preventing students from accessing administrative dispatch controls.

### 2. Built-in Local AI Triage Engine (Zero API Keys Required)
- **Automatic Category Suggestion**: Analyzes complaint title and description to detect matching campus facility (e.g. "sparking power outlet" → `Electrical`).
- **Urgency & Hazard Risk Scoring**: Evaluates critical hazard markers (fire, shock, bare wires, pipe flood) to elevate priority to `Critical` with clear safety risk explanations.
- **Smart Duplicate Detection**: Compares new complaints against active unresolved tickets in the same location to prevent ticket duplication.
- **AI Executive Brief**: Condenses student descriptions into a crisp summary for fast triage.
- **Suggested Department Routing**: Auto-recommends the responsible dispatch team.

### 3. Visual 5-Stage Status Timeline
- `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`
- Visual step milestones with active/completed indicators.
- Chronological audit log recording every transition, actor, and timestamp.

---

## 💻 Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom institutional palette & design tokens
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` / `sessionStorage`

---

## 🏃 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`

3. **Build for Production**:
   ```bash
   npm run build
   ```
