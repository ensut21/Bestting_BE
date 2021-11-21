const { check, body } = require("express-validator");

module.exports = {
  createTeam: [
    check("user_id").notEmpty().withMessage("is empty"),
    check("name").notEmpty().withMessage("is empty"),
  ],
  addTeamMembers: [
    body().isArray().notEmpty(),
    body("*.user_id").exists().isMongoId(),
    body("*.role_id").exists().isMongoId(),
  ],
};
