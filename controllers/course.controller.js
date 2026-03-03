const CourseSubmission = require('../models/course.model')

exports.createSubmission = async (req, res) => {
  try {
    const { fullName, email, course } = req.body;

    if (!fullName || !email || !course) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const submission = await CourseSubmission.create({
      fullName,
      email,
      course,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered",
      data: submission,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this course",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, course } = req.query;

    const query = course ? { course } : {};

    const submissions = await CourseSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CourseSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: submissions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};