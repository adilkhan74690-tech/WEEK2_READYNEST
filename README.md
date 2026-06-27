# Smart Campus Utility App

A Smart Campus Utility App built for the ReadyNest Summer Internship (Week 2). It helps students and teachers manage daily campus activities in one place.

## Features

- Student, Teacher & Admin Login
- Admin Approval System
- Attendance Management
- Timetable
- Task Management
- Notice Board
- Notes
- Profile Management

## Tech Stack

- React + Vite
- Node.js + Express.js
- MySQL
- JWT Authentication

## Getting Started

```bash
npm install
npm run dev
```

For backend:

```bash
cd server
npm install
npm start
```

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret
```

## Demo Accounts

**Admin**
- Email: admin@campus.com
- Password: Admin@123

**Teacher**
- Email: teacher@campus.com
- Password: Teacher@123

**Student**
- Email: student@campus.com
- Password: Student@123

> New Student and Teacher accounts require admin approval before login.

---

Developed by **Mohammad Adil Khan**