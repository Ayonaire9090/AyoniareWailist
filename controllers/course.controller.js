const CourseSubmission = require('../models/course.model')
const axios = require("axios");


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

    // normalize course input
    const normalizedCourse = course.toLowerCase().replace(/\s/g, "");

    const isDataAnalysis =
      normalizedCourse.includes("data") ||
      normalizedCourse.includes("analysis") ||
      normalizedCourse.includes("analyst") ||
      normalizedCourse.includes("analytics");

    if (isDataAnalysis) {
      try {
        await axios.post(
          "https://api.sendfox.com/contacts",
          {
            email: email,
            first_name: fullName,
            lists: [process.env.LIST_ID],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SEND_FOX_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.log("SendFox Error:", err.response?.data || err.message);
      }
    }

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