const { check, body } = require("express-validator");

module.exports = {
  createTeam: [
    check("user_id").notEmpty(),
    check("name").notEmpty(),
  ],
  addTeamMembers: [
    body().isArray().notEmpty(),
    body("*.user_id").isMongoId(),
    body("*.role_id").isMongoId(),
  ],
};