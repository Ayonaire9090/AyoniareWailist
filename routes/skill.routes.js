const express = require('express');
const router = express.Router();
const skillController = require("../controllers/skill.controller");

router.post('/', skillController.createSkill);
router.get('/', skillController.getSkills);


module.exports = router;
