const db = require("../config/db");

exports.getStudents = (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.createStudent = (req, res) => {
  const { id, userId, studentId, departmentId, courseId, academicSessionId, createdAt } = req.body;
  db.query(
    "INSERT INTO students (id, userId, studentId, departmentId, courseId, academicSessionId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, userId, studentId, departmentId, courseId, academicSessionId, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Student record created successfully" });
    }
  );
};
