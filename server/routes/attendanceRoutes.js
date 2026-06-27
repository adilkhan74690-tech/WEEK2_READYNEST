const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.get("/", attendanceController.getAttendance);
router.post("/", attendanceController.markAttendance);

router.get("/teacher", attendanceController.getTeacherAttendance);
router.post("/teacher", attendanceController.markTeacherAttendance);

module.exports = router;
