const router = require("express").Router();
const controllers = require("../../controllers/project.controller");
const validators = require("../../validators");

router.get("/:projectId", controllers.onGetById);
router.post("/", validators.project.createProject, controllers.onCreate);
router.patch(
  "/:projectId/members",
  validators.project.addProjectMembers,
  controllers.onAddProjectMembers
);
router.delete("/:projectId", controllers.onDelete);
router.delete(
  "/:projectId/members/:userId",
  controllers.onRemoveProjectMembers
);

module.exports = router;
