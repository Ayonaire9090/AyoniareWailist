const Skill = require('../models/skill.model');

exports.createSkill = async (req, res) => {
  try {
    const { name  } = req.body;
    const skill = new Skill({ name });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
