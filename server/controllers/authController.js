const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result[0];

      // Support fallback for plain text password comparison and bcrypt hashing
      let valid = (password === user.passwordHash);
      if (!valid) {
        try {
          valid = await bcrypt.compare(password, user.passwordHash);
        } catch (e) {
          valid = false;
        }
      }

      if (!valid) {
        return res.status(401).json({
          success: false,
          message: "Wrong Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET || "smartcampussecret",
        {
          expiresIn: "1d",
        }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          passwordHash: user.passwordHash,
          isActive: user.isActive === 1 || user.isActive === true || user.isActive === '1',
          createdAt: user.createdAt
        },
      });
    }
  );
};