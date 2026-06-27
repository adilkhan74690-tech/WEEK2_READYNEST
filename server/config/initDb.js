const bcrypt = require("bcryptjs");

const createTablesSql = [
  // 1. Users table
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt VARCHAR(50) NOT NULL,
    avatar LONGTEXT NULL
  ) ENGINE=InnoDB;`,

  // 2. Departments table
  `CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    head VARCHAR(255) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 3. Courses table
  `CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    departmentId VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 4. Students table
  `CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    studentId VARCHAR(50) UNIQUE NOT NULL,
    departmentId VARCHAR(50) NOT NULL,
    courseId VARCHAR(50) NOT NULL,
    academicSessionId VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 5. Teachers table
  `CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    office VARCHAR(255) NOT NULL,
    departmentId VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 6. Subjects table
  `CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    departmentId VARCHAR(50) NOT NULL,
    courseId VARCHAR(50) NOT NULL,
    teacherId VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 7. Timetables table
  `CREATE TABLE IF NOT EXISTS timetables (
    id VARCHAR(50) PRIMARY KEY,
    subjectId VARCHAR(50) NOT NULL,
    courseId VARCHAR(50) NOT NULL,
    teacherId VARCHAR(50) NOT NULL,
    room VARCHAR(255) NOT NULL,
    day VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    durationHours INT NOT NULL
  ) ENGINE=InnoDB;`,

  // 8. Attendance table
  `CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    studentId VARCHAR(50) NOT NULL,
    subjectId VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    markedBy VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 9. Teacher Attendance table
  `CREATE TABLE IF NOT EXISTS teacher_attendance (
    id VARCHAR(50) PRIMARY KEY,
    teacherId VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    markedAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 10. Assignments table
  `CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    subjectId VARCHAR(50) NOT NULL,
    dueDate VARCHAR(50) NOT NULL,
    departmentId VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 11. Assignment Submissions table
  `CREATE TABLE IF NOT EXISTS assignment_submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignmentId VARCHAR(50) NOT NULL,
    studentId VARCHAR(50) NOT NULL,
    submissionDate VARCHAR(50) NOT NULL,
    fileUrl TEXT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NULL,
    feedback TEXT NULL
  ) ENGINE=InnoDB;`,

  // 12. Study Materials table
  `CREATE TABLE IF NOT EXISTS study_materials (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    fileUrl TEXT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    subjectId VARCHAR(50) NOT NULL,
    uploadedBy VARCHAR(50) NOT NULL,
    createdAt VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 13. Notices table
  `CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isPinned BOOLEAN NOT NULL DEFAULT FALSE
  ) ENGINE=InnoDB;`,

  // 14. Results table
  `CREATE TABLE IF NOT EXISTS results (
    id VARCHAR(50) PRIMARY KEY,
    studentId VARCHAR(50) NOT NULL,
    subjectId VARCHAR(50) NOT NULL,
    academicSessionId VARCHAR(50) NOT NULL,
    internalMarks INT NOT NULL,
    externalMarks INT NOT NULL,
    totalMarks INT NOT NULL,
    grade VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 15. Academic Sessions table
  `CREATE TABLE IF NOT EXISTS academic_sessions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT FALSE,
    startDate VARCHAR(50) NOT NULL,
    endDate VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 16. Notes table
  `CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    lastModified VARCHAR(50) NOT NULL
  ) ENGINE=InnoDB;`,

  // 17. Settings table
  `CREATE TABLE IF NOT EXISTS settings (
    cfg_key VARCHAR(255) PRIMARY KEY,
    cfg_val TEXT NOT NULL
  ) ENGINE=InnoDB;`
];

async function initializeDatabase(db) {
  console.log("🛠️ Starting database schema initialization...");

  // Check if users table exists and check its columns
  const tableCheck = await new Promise((resolve) => {
    db.query("SHOW COLUMNS FROM users", (err, result) => {
      if (err) resolve(null); // Table doesn't exist
      else resolve(result);
    });
  });

  if (tableCheck) {
    const hasPasswordHash = tableCheck.some(col => col.Field === 'passwordHash');
    const hasAvatar = tableCheck.some(col => col.Field === 'avatar');
    if (!hasPasswordHash || !hasAvatar) {
      console.log("⚠️ Old users table schema detected. Dropping to recreate with correct columns.");
      await new Promise((resolve, reject) => {
        db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => (err ? reject(err) : resolve()));
      });
      await new Promise((resolve, reject) => {
        db.query("DROP TABLE users", (err) => (err ? reject(err) : resolve()));
      });
      await new Promise((resolve, reject) => {
        db.query("SET FOREIGN_KEY_CHECKS = 1", (err) => (err ? reject(err) : resolve()));
      });
    }
  }

  // Run table creations sequentially to maintain consistency
  for (const sql of createTablesSql) {
    await new Promise((resolve, reject) => {
      db.query(sql, (err) => {
        if (err) {
          console.error("Error creating table structure. Query:", sql);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  console.log("✅ Database schema structure verified.");

  // Check if users exist to determine if seeding is required
  const userCount = await new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
      if (err) reject(err);
      else resolve(result[0].count);
    });
  });

  if (userCount === 0) {
    console.log("🌱 Database is empty. Seeding initial academic mock dataset...");
    await seedInitialData(db);
  } else {
    console.log("📈 Database already initialized with records. Skipping seeding.");
  }
}

async function seedInitialData(db) {
  const seedTime = new Date().toISOString();

  // 1. Seed Users
  const seedUsers = [
    { id: 'usr-admin', name: 'Dr. Jane Admin', email: 'admin@college.edu', role: 'ADMIN', passwordHash: bcrypt.hashSync('admin123', 10), isActive: true, createdAt: seedTime }
  ];

  for (const user of seedUsers) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO users (id, email, name, role, passwordHash, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [user.id, user.email, user.name, user.role, user.passwordHash, user.isActive, user.createdAt],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 2. Seed Departments
  const seedDepts = [
    { id: 'dept-cs', name: 'Computer Science & Engineering', code: 'CS', head: 'Prof. Alan Turing', createdAt: seedTime },
    { id: 'dept-phys', name: 'Physics & Quantum Mechanics', code: 'PHYS', head: 'Prof. Richard Feynman', createdAt: seedTime }
  ];

  for (const dept of seedDepts) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO departments (id, name, code, head, createdAt) VALUES (?, ?, ?, ?, ?)",
        [dept.id, dept.name, dept.code, dept.head, dept.createdAt],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 3. Seed Courses
  const seedCourses = [
    { id: 'crs-bsc-cs', name: 'B.Sc Computer Science', code: 'BSC-CS', departmentId: 'dept-cs', createdAt: seedTime },
    { id: 'crs-msc-qm', name: 'M.Sc Quantum Mechanics', code: 'MSC-QM', departmentId: 'dept-phys', createdAt: seedTime }
  ];

  for (const course of seedCourses) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO courses (id, name, code, departmentId, createdAt) VALUES (?, ?, ?, ?, ?)",
        [course.id, course.name, course.code, course.departmentId, course.createdAt],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 4. Seed Teachers (Empty)
  const seedTeachers = [];

  // 5. Seed Academic Sessions
  const seedSessions = [
    { id: 'sess-fall', name: 'Fall Term 2026', isActive: true, startDate: '2026-09-01', endDate: '2026-12-20' }
  ];

  for (const sess of seedSessions) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO academic_sessions (id, name, isActive, startDate, endDate) VALUES (?, ?, ?, ?, ?)",
        [sess.id, sess.name, sess.isActive, sess.startDate, sess.endDate],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 6. Seed Students (Empty)
  const seedStudents = [];

  // 7. Seed Subjects (teacherId empty)
  const seedSubjects = [
    { id: 'sub-db', name: 'Advanced Databases', code: 'CS-102', departmentId: 'dept-cs', courseId: 'crs-bsc-cs', teacherId: '', createdAt: seedTime },
    { id: 'sub-quantum', name: 'Quantum Electrodynamics', code: 'PHYS-205', departmentId: 'dept-phys', courseId: 'crs-msc-qm', teacherId: '', createdAt: seedTime }
  ];

  for (const sub of seedSubjects) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO subjects (id, name, code, departmentId, courseId, teacherId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [sub.id, sub.name, sub.code, sub.departmentId, sub.courseId, sub.teacherId, sub.createdAt],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 8. Seed TimetableSlots (teacherId empty)
  const seedTimetables = [
    { id: 'slot-1', subjectId: 'sub-db', courseId: 'crs-bsc-cs', teacherId: '', room: 'Lab-1', day: 'Monday', time: '09:00', durationHours: 2 },
    { id: 'slot-2', subjectId: 'sub-quantum', courseId: 'crs-msc-qm', teacherId: '', room: 'Hall B', day: 'Wednesday', time: '11:00', durationHours: 1 }
  ];

  for (const slot of seedTimetables) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO timetables (id, subjectId, courseId, teacherId, room, day, time, durationHours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [slot.id, slot.subjectId, slot.courseId, slot.teacherId, slot.room, slot.day, slot.time, slot.durationHours],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 9. Seed Notices
  const seedNotices = [
    {
      id: 'not-1',
      title: 'Midterm schedule published',
      content: 'Mid-term theory evaluations are slated to begin starting October 5th. Review timetables under the schedule tab.',
      category: 'Academic',
      date: new Date().toLocaleDateString(),
      author: 'Office of Super Admin',
      isPinned: true
    }
  ];

  for (const notice of seedNotices) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT IGNORE INTO notices (id, title, content, category, date, author, isPinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [notice.id, notice.title, notice.content, notice.category, notice.date, notice.author, notice.isPinned],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  // 10. Seed Settings
  const defaultSettings = {
    campusName: 'Smart Campus University',
    academicYear: '2026-2027',
    maxCapacity: 5000,
    enableNotifications: true,
    backupInterval: 'Daily',
    systemVersion: '2.0.0'
  };

  for (const [key, val] of Object.entries(defaultSettings)) {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO settings (cfg_key, cfg_val) VALUES (?, ?) ON DUPLICATE KEY UPDATE cfg_val=?",
        [key, String(val), String(val)],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  console.log("🌱 Database seeded successfully!");
}

module.exports = {
  initializeDatabase
};
