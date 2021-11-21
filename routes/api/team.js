const router = require('express').Router();
const controllers = require('../../controllers/team.controller');
const validators = require('../../validators');

router.post('/', validators.team.createTeam, controllers.onCreate);
router.patch('/:teamId/members', validators.team.addTeamMembers, controllers.onAddTeamMembers);


module.exports = router;