const { validationResult } = require("express-validator");
const Service = require("../services/team.service");

const { ErrorForbidden } = require("../configs/errorMetods");
const {
  Success,
} = require("../configs/successMethods");

const methods = {
  async onCreate(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden(errors);
      }
      const result = await Service.createTeam(req.body);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onAddTeamMembers(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden({ errors: errors.array() });
      }

      const { teamId } = req.params;

      const userIdList = req.body.map((member) => member.user_id);

      const result = await Service.addTeamMembers(teamId, userIdList, req.body);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onRemoveTeamMembers(req, res, next) {
    try {
      const { teamId, userId } = req.params;

      const result = await Service.removeTeamMember(teamId ,userId);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { ...methods };
