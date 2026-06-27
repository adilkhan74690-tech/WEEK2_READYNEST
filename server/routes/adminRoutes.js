const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/departments", adminController.getDepartments);
router.post("/departments", adminController.createDepartment);

router.get("/courses", adminController.getCourses);
router.post("/courses", adminController.createCourse);

router.get("/subjects", adminController.getSubjects);
router.post("/subjects", adminController.createSubject);

module.exports = router;
