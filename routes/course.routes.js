

const submission = require('../controllers/course.controller')

const express = require('express');
const router = express.Router();

router.post("/course-submission", submission.createSubmission);
router.get("/course-submission", submission.getSubmissions);

module.exports = router;