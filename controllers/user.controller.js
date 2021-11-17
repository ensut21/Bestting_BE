const { validationResult } = require("express-validator");
const Service = require("../services/user.service");
const { ErrorForbidden } = require('../configs/errorMetods');

const methods = {
  async onGetAll(req, res, next) {
    try {
    } catch (error) { }
  },

  async onGetById(req, res, next) {
    try {

      const { id } = req.params;

      const result = await Service.findById(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async onInsert(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden('Missing or invalid parameter');
      }

      const result = await Service.create({
        ...req.body,
        color_code: `#${((1<<24)*Math.random() | 0).toString(16)}`
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async onUpdate(req, res, next) {
    try {

    } catch (error) {
      
    }
  },

  async onDelete(req, res, next) {
    try {
    } catch (error) { }
  },
};

module.exports = { ...methods };
