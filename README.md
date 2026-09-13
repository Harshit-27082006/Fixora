# FIXORA — Campus Complaint Management System

> **Report. Track. Resolve.**  
> A modern responsive web prototype for university and college facility complaint lifecycle management with built-in AI triage.

---

## 🌟 Overview

**FIXORA** is an end-to-end campus issue resolution platform designed for students, administrators, and maintenance departments. It covers classrooms, laboratories, hostels, electricity, internet, cleanliness, transport, and overall campus infrastructure.

### Core Lifecycle Flow
```
REPORT ──> VALIDATE ──> STORE ──> ASSIGN ──> UPDATE ──> RESOLVE
```

---

## 🚀 Key Features

### 1. Multi-Role Workflows with 1-Click Role Switcher
- **Student / Staff Portal**: Report campus disruptions, view live status timelines, receive notification alerts, and submit satisfaction feedback upon resolution.
- **Central Admin Command Center**: Campus-wide KPIs, priority triage queue, department workload balancing, assigning tickets to departments, and adjusting SLAs.
- **Department Queue (9 Facilities)**: Electrical, IT / Internet, Hostel, Cleanliness, Transport, Laboratory, Classroom, Maintenance, and Other. Specialized view for field technicians to post progress notes and mark fixes.
- **Top Quick Switcher**: Persistent bar at the top of the app allowing evaluators and judges to instantly toggle between Student, Admin, and Department modes.

### 2. Built-in Local AI Engine (Zero API Keys Required)
- **Automatic Category Suggestion**: Analyzes complaint title and description to detect matching campus facility (e.g. "sparking power outlet" → `Electrical`).
- **Urgency & Hazard Risk Scoring**: Evaluates critical hazard markers (fire, shock, bare wires, pipe flood) to elevate priority to `Critical` with clear safety risk explanations.
- **Smart Duplicate Detection**: Compares new complaints against active unresolved tickets in the same location to prevent ticket duplication.
- **AI One-Line Executive Brief**: Condenses student descriptions into a crisp summary for fast triage.
- **Suggested Department Routing**: Auto-recommends the responsible dispatch team.

### 3. Visual 5-Stage Status Timeline
- `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`
- Visual step milestones with active/completed indicators.
- Chronological audit log recording every transition, actor, and timestamp.

### 4. Persistence & Demo Readiness
- Uses browser `localStorage` to persist newly created tickets, status transitions, and comments.
- Includes a **"Reset Demo Data"** button to cleanly restore initial pre-populated realistic campus complaints at any time.

---

## 💻 Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom palette & design tokens
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage`

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
   Preview the production build:
   ```bash
   npm run preview
   ```

---

## 👥 Pre-Configured Demo Accounts
| Role | Name | Designation / Roll |
|---|---|---|
| **Student** | Aarav Sharma | B.Tech CSE (CS-2023-042), Hostel 3 |
| **Admin** | Dr. Sunita Mehra | Dean of Campus Operations |
| **Electrical Dept** | Rajesh Rao | Senior Electrical Engineer |
| **IT / Network Dept** | Priya Patel | Campus Network Lead |
| **Hostel Admin** | Ramesh Kumar | Chief Hostel Warden |
