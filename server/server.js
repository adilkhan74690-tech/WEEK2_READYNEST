const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Bind Domain Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus ERP Backend Running",
  });
});

// Helper: Synchronize standard table array
async function syncTable(tableName, incomingArray, columns, db) {
  if (!incomingArray) return;
  
  // 1. Insert/Update incoming items using ON DUPLICATE KEY UPDATE
  for (const item of incomingArray) {
    const vals = columns.map(col => {
      let val = item[col];
      if (typeof val === 'boolean') {
        val = val ? 1 : 0;
      }
      return val === undefined ? null : val;
    });
    
    const placeholders = columns.map(() => "?").join(", ");
    const updateClause = columns.filter(col => col !== 'id').map(col => `\`${col}\` = VALUES(\`${col}\`)`).join(", ");
    
    const sql = `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(", ")}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`;
    
    await new Promise((resolve, reject) => {
      db.query(sql, vals, (err) => (err ? reject(err) : resolve()));
    });
  }

  // 2. Delete database items that are not in the incoming list
  const incomingIds = incomingArray.map(item => item.id).filter(id => id);
  if (incomingIds.length > 0) {
    const placeholders = incomingIds.map(() => "?").join(", ");
    const sql = `DELETE FROM \`${tableName}\` WHERE \`id\` NOT IN (${placeholders})`;
    await new Promise((resolve, reject) => {
      db.query(sql, incomingIds, (err) => (err ? reject(err) : resolve()));
    });
  } else {
    const sql = `DELETE FROM \`${tableName}\``;
    await new Promise((resolve, reject) => {
      db.query(sql, (err) => (err ? reject(err) : resolve()));
    });
  }
}

// Helper: Synchronize key-value settings table
async function syncSettings(settingsObj, db) {
  if (!settingsObj) return;
  for (const [key, val] of Object.entries(settingsObj)) {
    const sql = `INSERT INTO settings (cfg_key, cfg_val) VALUES (?, ?) ON DUPLICATE KEY UPDATE cfg_val = VALUES(cfg_val)`;
    await new Promise((resolve, reject) => {
      db.query(sql, [key, String(val)], (err) => (err ? reject(err) : resolve()));
    });
  }
}

// FETCH FULL DB STATE
app.get("/api/db", async (req, res) => {
  try {
    const fetchTable = (tableName) => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM \`${tableName}\``, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    const users = await fetchTable("users");
    const students = await fetchTable("students");
    const teachers = await fetchTable("teachers");
    const departments = await fetchTable("departments");
    const courses = await fetchTable("courses");
    const subjects = await fetchTable("subjects");
    const timetables = await fetchTable("timetables");
    const attendance = await fetchTable("attendance");
    const teacher_attendance = await fetchTable("teacher_attendance");
    const assignments = await fetchTable("assignments");
    const assignment_submissions = await fetchTable("assignment_submissions");
    const study_materials = await fetchTable("study_materials");
    const notices = await fetchTable("notices");
    const results = await fetchTable("results");
    const academic_sessions = await fetchTable("academic_sessions");
    const notes = await fetchTable("notes");
    const settingsRows = await fetchTable("settings");

    // Format boolean fields properly from MySQL tinyint
    const formattedUsers = users.map(u => ({
      ...u,
      isActive: u.isActive === 1 || u.isActive === true || u.isActive === '1'
    }));

    const formattedNotices = notices.map(n => ({
      ...n,
      isPinned: n.isPinned === 1 || n.isPinned === true || n.isPinned === '1'
    }));

    const formattedSessions = academic_sessions.map(s => ({
      ...s,
      isActive: s.isActive === 1 || s.isActive === true || s.isActive === '1'
    }));

    // Reconstruct settings key-value object
    const settingsObj = {};
    settingsRows.forEach(row => {
      let val = row.cfg_val;
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(val) && val.trim() !== '') val = Number(val);
      settingsObj[row.cfg_key] = val;
    });

    res.json({
      users: formattedUsers,
      students,
      teachers,
      departments,
      courses,
      subjects,
      timetables,
      attendance,
      teacher_attendance,
      assignments,
      assignment_submissions,
      study_materials,
      notices: formattedNotices,
      results,
      academic_sessions: formattedSessions,
      notes,
      settings: settingsObj,
      currentUser: null,
      token: null
    });
  } catch (err) {
    console.error("Failed to load database state:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SYNC FULL DB STATE
app.post("/api/db/sync", async (req, res) => {
  try {
    const dbState = req.body;
    if (!dbState) {
      return res.status(400).json({ success: false, message: "Missing database state body" });
    }

    // Temporarily disable foreign key checks for bulk synchronization
    await new Promise((resolve, reject) => {
      db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => (err ? reject(err) : resolve()));
    });

    // Sync all arrays
    await syncTable("users", dbState.users, ['id', 'email', 'name', 'role', 'passwordHash', 'isActive', 'createdAt', 'avatar'], db);
    await syncTable("departments", dbState.departments, ['id', 'name', 'code', 'head', 'createdAt'], db);
    await syncTable("courses", dbState.courses, ['id', 'name', 'code', 'departmentId', 'createdAt'], db);
    await syncTable("students", dbState.students, ['id', 'userId', 'studentId', 'departmentId', 'courseId', 'academicSessionId', 'createdAt'], db);
    await syncTable("teachers", dbState.teachers, ['id', 'userId', 'office', 'departmentId', 'createdAt'], db);
    await syncTable("subjects", dbState.subjects, ['id', 'name', 'code', 'departmentId', 'courseId', 'teacherId', 'createdAt'], db);
    await syncTable("timetables", dbState.timetables, ['id', 'subjectId', 'courseId', 'teacherId', 'room', 'day', 'time', 'durationHours'], db);
    await syncTable("attendance", dbState.attendance, ['id', 'studentId', 'subjectId', 'date', 'status', 'markedBy'], db);
    await syncTable("teacher_attendance", dbState.teacher_attendance, ['id', 'teacherId', 'date', 'status', 'markedAt'], db);
    await syncTable("assignments", dbState.assignments, ['id', 'title', 'instructions', 'subjectId', 'dueDate', 'departmentId', 'createdAt'], db);
    await syncTable("assignment_submissions", dbState.assignment_submissions, ['id', 'assignmentId', 'studentId', 'submissionDate', 'fileUrl', 'fileName', 'status', 'grade', 'feedback'], db);
    await syncTable("study_materials", dbState.study_materials, ['id', 'title', 'description', 'fileType', 'fileUrl', 'fileName', 'subjectId', 'uploadedBy', 'createdAt'], db);
    await syncTable("notices", dbState.notices, ['id', 'title', 'content', 'category', 'date', 'author', 'isPinned'], db);
    await syncTable("results", dbState.results, ['id', 'studentId', 'subjectId', 'academicSessionId', 'internalMarks', 'externalMarks', 'totalMarks', 'grade'], db);
    await syncTable("academic_sessions", dbState.academic_sessions, ['id', 'name', 'isActive', 'startDate', 'endDate'], db);
    await syncTable("notes", dbState.notes, ['id', 'title', 'content', 'category', 'lastModified'], db);
    
    // Sync settings object
    await syncSettings(dbState.settings, db);

    res.json({ success: true, message: "Database synchronized successfully" });
  } catch (err) {
    console.error("Sync failed:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    // Always re-enable foreign key checks
    db.query("SET FOREIGN_KEY_CHECKS = 1", (err) => {
      if (err) console.error("Failed to re-enable foreign key checks:", err);
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});