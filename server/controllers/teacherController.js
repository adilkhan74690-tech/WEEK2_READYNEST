const db = require("../config/db");

exports.getTeachers = (req, res) => {
  db.query("SELECT * FROM teachers", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.createTeacher = (req, res) => {
  const { id, userId, office, departmentId, createdAt } = req.body;
  db.query(
    "INSERT INTO teachers (id, userId, office, departmentId, createdAt) VALUES (?, ?, ?, ?, ?)",
    [id, userId, office, departmentId, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Teacher record created successfully" });
    }
  );
};
