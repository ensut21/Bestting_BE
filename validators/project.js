const { check, body } = require("express-validator");

module.exports = {
  createProject: [
    check("user_id").notEmpty(),
    check("name").notEmpty(),
    check("team_id").notEmpty(),
  ],
  addProjectMembers: [
    body().isArray().notEmpty(),
    body("*.user_id").isMongoId(),
    body("*.role_id").isMongoId(),
  ],
};
