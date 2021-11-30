const router = require("express").Router();
const controllers = require("../../controllers/team.controller");
const validators = require("../../validators");

router.get("/:teamId", controllers.onGetById);
router.post("/", validators.team.createTeam, controllers.onCreate);
router.patch(
  "/:teamId/members",
  validators.team.addTeamMembers,
  controllers.onAddTeamMembers
);
router.delete("/:teamId", controllers.onDelete);
router.delete("/:teamId/members/:userId", controllers.onRemoveTeamMembers);

module.exports = router;
