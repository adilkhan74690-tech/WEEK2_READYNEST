const db = require("../config/db");

exports.getNotices = (req, res) => {
  db.query("SELECT * FROM notices ORDER BY isPinned DESC, date DESC", (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    const formatted = result.map(n => ({
      ...n,
      isPinned: n.isPinned === 1 || n.isPinned === true || n.isPinned === '1'
    }));
    res.json({ success: true, data: formatted });
  });
};

exports.createNotice = (req, res) => {
  const { id, title, content, category, date, author, isPinned } = req.body;
  const isPinnedVal = isPinned ? 1 : 0;
  db.query(
    "INSERT INTO notices (id, title, content, category, date, author, isPinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, title, content, category, date, author, isPinnedVal],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Notice created successfully" });
    }
  );
};

exports.updateNotice = (req, res) => {
  const { id } = req.params;
  const { title, content, category, date, author, isPinned } = req.body;
  const isPinnedVal = isPinned ? 1 : 0;
  db.query(
    "UPDATE notices SET title = ?, content = ?, category = ?, date = ?, author = ?, isPinned = ? WHERE id = ?",
    [title, content, category, date, author, isPinnedVal, id],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Notice updated successfully" });
    }
  );
};

exports.deleteNotice = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notices WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: "Notice deleted successfully" });
  });
};
