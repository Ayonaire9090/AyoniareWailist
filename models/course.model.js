const mongoose = require('mongoose');

const CourseSubmissionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    course: {
      type: String,
      required: true,
      enum: [
        "AI Engineering",
        "Data Science & Gen AI",
        "Data Analysis",
      ],
    },
  },
  { timestamps: true }
);


CourseSubmissionSchema.index(
  { email: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model("CourseSubmission", CourseSubmissionSchema);