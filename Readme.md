<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=2563eb&height=200&section=header&text=Hostel%20Management%20System&fontSize=50&fontAlignY=35&desc=A%20Complete%20Hostel%20Operations%20Platform&descAlignY=55&descAlign=50" alt="header" />
</div>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-user-roles--workflows">User Workflows</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-author">Author</a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

---

## 🌟 Overview

The **Hostel Management System** is a full-stack web application developed to replace manual, paper-based hostel management processes with a centralized digital solution. It addresses the day-to-day challenges of running large student accommodations by providing dedicated, secure portals for every role involved in the ecosystem. 

Whether it is a student reporting a broken fan, a maintenance worker checking their daily tasks, or a warden broadcasting an urgent water shortage announcement, this platform handles the data flow efficiently in real-time.

---

## 🚀 Tech Stack

### Frontend
- **React 18 (Vite):** Chosen for its fast HMR and component-based architecture, making UI state management predictable.
- **Vanilla CSS & Framer Motion:** Used exclusively to build a custom design system from scratch. Framer Motion is implemented for fluid route transitions, modal pop-ups, and micro-interactions without relying on heavy UI libraries.
- **Axios:** Configured with global interceptors to automatically attach JWT bearer tokens to outbound requests.
- **React Router Dom:** Manages client-side routing across 5 distinct role-based dashboards and handles protected routes.

### Backend
- **Node.js & Express.js:** Serves as the REST API gateway, routing requests to the appropriate controllers and managing middleware.
- **MongoDB & Mongoose:** A NoSQL database schema designed with referenced documents (e.g., Complaints referencing Students) to maintain relational integrity while keeping read times low.
- **JSON Web Tokens (JWT):** Implements stateless authentication. Passwords are never sent in plain text, and role-based access control (RBAC) is enforced at the middleware level.
- **Bcrypt.js:** Handles cryptographic hashing of all user and staff passwords before storing them in the database.

---

## 👥 Detailed User Workflows

The architecture is split into 5 core roles. The backend middleware strictly verifies the JWT role before allowing access to specific API endpoints.

### 🎓 1. Student Portal
Students are the primary end-users of the system. Upon logging in, they land on a personalized dashboard that provides an overview of their hostel life.
- **Maintenance & Complaints:** Students can create a complaint ticket, selecting a category (Housekeeping, Carpenter, Electrician). They can attach images of the issue. The ticket is immediately routed to the respective worker's queue. Students can track the live status (Pending -> In Progress -> Resolved).
- **Night Canteen Ordering:** A digital menu replaces physical ordering. Students can view available items, add them to a cart, and place orders directly to the canteen staff. 
- **Mess Management:** Students can view the daily food menu and submit ratings/feedback. This data is aggregated for the Warden to review.
- **Announcements:** A notification feed displays urgent and general broadcasts published by the administration.

### 🛡️ 2. Warden Portal
Wardens oversee the entire hostel block. Their dashboard is heavily analytical.
- **Global Overview:** Wardens see aggregated statistics: total residents, unresolved complaints, and active staff.
- **Complaint Auditing:** While workers fix the issues, wardens can monitor the resolution time and escalate complaints that have been pending for too long.
- **Broadcasting:** Wardens have the authority to publish announcements. Marking an announcement as "Important" pins it to the top of all student dashboards.

### 🔧 3. Worker Portal
Maintenance staff require a noise-free interface focusing only on their duties.
- **Filtered Task Queue:** An electrician logging in will *only* see complaints categorized under "Electrical". They won't see housekeeping requests.
- **Task Lifecycle:** Workers update the status of a task from "Pending" to "In Progress" when they begin work, and "Resolved" once finished. This instantly updates the student's view.

### 🏪 4. Canteen Staff Portal
Built for high-speed, live operations during peak night hours.
- **Order Management:** A live queue displays incoming orders. Staff can mark orders as "Preparing" or "Completed".
- **Dynamic Inventory:** A one-click toggle allows staff to mark menu items as "Out of Stock" to prevent students from ordering unavailable items.

### 💼 5. CTS Admin (Management)
The highest level of access, reserved for the core technical and administrative team.
- **System-Wide Analytics:** Access to global metrics across all modules.
- **Access Control:** The admin can register new wardens, workers, and canteen staff, securely hashing their credentials into the database.
- **Student Onboarding:** Supports single-student creation or bulk operations for allocating rooms at the start of a semester.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Hostel-Management-System.git
cd Hostel-Management-System
```

### 2. Backend Environment
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_key
```
Start the backend server:
```bash
npm run dev
```
*(Note: Starting the server for the first time will automatically seed the database with demo accounts and data.)*

### 3. Frontend Environment
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 📸 Application Screenshots

*(Screenshots to be added here by dropping them into the `screenshots/` directory)*

### Landing Page & Unified Login
<p align="center">
  <!-- <img src="./screenshots/landing.png" alt="Landing Page" width="45%" /> -->
  <!-- <img src="./screenshots/login.png" alt="Login Page" width="45%" /> -->
</p>

### Student Dashboard
<p align="center">
  <!-- <img src="./screenshots/student_dashboard.png" alt="Student Dashboard" width="80%" /> -->
</p>

### Warden Overview
<p align="center">
  <!-- <img src="./screenshots/warden_dashboard.png" alt="Warden Dashboard" width="80%" /> -->
</p>

### Canteen Management
<p align="center">
  <!-- <img src="./screenshots/canteen_dashboard.png" alt="Canteen Dashboard" width="80%" /> -->
</p>

### CTS Admin (Management)
<p align="center">
  <!-- <img src="./screenshots/cts_admin.png" alt="CTS Admin" width="80%" /> -->
</p>

---

<br />

> **Copyright © 2026 Ritu Raj Singh. All rights reserved.**  
> This software and its associated documentation are copyright protected. No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the author.