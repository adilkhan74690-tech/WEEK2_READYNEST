const db = require("../config/db");

exports.getAttendance = (req, res) => {
  db.query("SELECT * FROM attendance", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.markAttendance = (req, res) => {
  const { id, studentId, subjectId, date, status, markedBy } = req.body;
  db.query(
    "INSERT INTO attendance (id, studentId, subjectId, date, status, markedBy) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?, markedBy = ?",
    [id, studentId, subjectId, date, status, markedBy, status, markedBy],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Attendance marked successfully" });
    }
  );
};

exports.getTeacherAttendance = (req, res) => {
  db.query("SELECT * FROM teacher_attendance", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.markTeacherAttendance = (req, res) => {
  const { id, teacherId, date, status, markedAt } = req.body;
  db.query(
    "INSERT INTO teacher_attendance (id, teacherId, date, status, markedAt) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?, markedAt = ?",
    [id, teacherId, date, status, markedAt, status, markedAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Teacher attendance marked successfully" });
    }
  );
};
