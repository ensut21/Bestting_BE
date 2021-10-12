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
    } catch (error) { }
  },

  async onInsert(req, res, next) {
    try {
    } catch (error) { }
  },

  async onUpdate(req, res, next) {
    try {
    } catch (error) { }
  },

  async onDelete(req, res, next) {
    try {
    } catch (error) { }
  },

  async onRegisterByEmail(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden('Missing or invalid parameter');
      }
      const result = Service.create(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },

  async onLoginByEmail(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw ErrorForbidden('Missing or invalid parameter');
      }
      const result = await Service.loginByEmail(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },

  async onLoginByGoogle(req, res, next) {
    try {
    } catch (error) { }
  },

  async onLoginByFacebook(req, res, next) {
    try {
    } catch (error) { }
  },

  async onRefreshToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        throw ErrorForbidden('Missing or invalid parameter');
      }
      const result = await Service.refreshToken(req.headers.authorization.split(' ')[1]);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { ...methods };
