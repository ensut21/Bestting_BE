const { validationResult } = require("express-validator");
const Service = require("../services/project.service");

const { ErrorForbidden } = require("../configs/errorMetods");
const { Success, SuccessCreated } = require("../configs/successMethods");

const methods = {
  async onGetById(req, res, next) {
    try {
      const { projectId } = req.params;
      const result = await Service.getProjectById(projectId);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onCreate(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden(errors);
      }
      const result = await Service.createProject(req.body);

      const response = SuccessCreated(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onDelete(req, res, next) {
    try {
      const { projectId } = req.params;
      const result = await Service.deleteProject(projectId);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onAddProjectMembers(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden(errors);
      }
      const { projectId } = req.params;

      const userIdList = req.body.map((member) => member.user_id);

      const result = await Service.addProjectMembers(
        projectId,
        userIdList,
        req.body
      );

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async onRemoveProjectMembers(req, res, next) {
    try {
      const { projectId, userId } = req.params;

      const result = await Service.removeProjectMembers(projectId, userId);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ...methods };
