const { check, body } = require("express-validator");

module.exports = {
  createTeam: [
    check("user_id").notEmpty().withMessage("is empty"),
    check("name").notEmpty().withMessage("is empty"),
  ],
  addTeamMembers: [
    body().isArray(),
    check("members.*.user_id").notEmpty().withMessage("is empty"),
    check("members.*.role").notEmpty().withMessage("is empty"),
  ],
};
