const db = require("../config/db");

exports.getDepartments = (req, res) => {
  db.query("SELECT * FROM departments", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.createDepartment = (req, res) => {
  const { id, name, code, head, createdAt } = req.body;
  db.query(
    "INSERT INTO departments (id, name, code, head, createdAt) VALUES (?, ?, ?, ?, ?)",
    [id, name, code, head, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Department created successfully" });
    }
  );
};

exports.deleteDepartment = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM subjects WHERE departmentId = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    db.query("DELETE FROM courses WHERE departmentId = ?", [id], (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      db.query("DELETE FROM departments WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Department and associated data deleted successfully" });
      });
    });
  });
};

exports.getCourses = (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.createCourse = (req, res) => {
  const { id, name, code, departmentId, createdAt } = req.body;
  db.query(
    "INSERT INTO courses (id, name, code, departmentId, createdAt) VALUES (?, ?, ?, ?, ?)",
    [id, name, code, departmentId, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Course created successfully" });
    }
  );
};

exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM subjects WHERE courseId = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    db.query("DELETE FROM courses WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Course and associated subjects deleted successfully" });
    });
  });
};

exports.getSubjects = (req, res) => {
  db.query("SELECT * FROM subjects", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: result });
  });
};

exports.createSubject = (req, res) => {
  const { id, name, code, departmentId, courseId, teacherId, createdAt } = req.body;
  db.query(
    "INSERT INTO subjects (id, name, code, departmentId, courseId, teacherId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, code, departmentId, courseId, teacherId, createdAt],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Subject created successfully" });
    }
  );
};

exports.deleteSubject = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM subjects WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: "Subject deleted successfully" });
  });
};
