const { validationResult } = require("express-validator");
const Service = require("../services/user.service");

const { ErrorForbidden } = require("../configs/errorMetods");
const {
  Success,
  SuccessCreated,
  SuccessUpdated,
  SuccessDeleted,
} = require("../configs/successMethods");

const methods = {
  async onGetAll(req, res, next) {
    try {
      const result = await Service.findAll(req.query);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.log(error)
      next(error);
    }
  },

  async onGetById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await Service.findById(id);

      const response = Success(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  async onInsert(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden("Missing or invalid parameter");
      }

      const result = await Service.create({
        ...req.body,
        color_code: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
      });

      const response = SuccessCreated(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  async onUpdate(req, res, next) {
    try {
      const { id } = req.params;

      const result = await Service.update(id, {
        ...req.body,
        updated_at: Date.now(),
      });

      const response = SuccessUpdated(result);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  async onDelete(req, res, next) {
    try {
      const { id } = req.params;

      await Service.update(id, {
        updated_at: Date.now(),
        terminated_at: Date.now(),
      });

      const response = SuccessDeleted();
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ...methods };
