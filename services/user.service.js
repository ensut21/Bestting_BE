const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { v4: uuid_v4 } = require('uuid');

const { users } = require('../models');
const { ErrorUnauthorized } = require('../configs/errorMetods');
const config = require('../configs');

const methods = {
    create(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    user_id: uuid_v4().replace(/-/g, ""),
                    firstname: body.firstname,
                    lastname: body.lastname,
                    authorization: {
                        grant_type: body.grant_type,
                        email: body.email,
                        password: body.password,
                    },
                };
                const user = await users.create(data);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    },

    loginByEmail(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await users.findOne({
                    where: {
                        authorization: {
                            email: {
                                [Op.eq]: body.email,
                            }
                        }
                    }
                });

                if (!user) throw ErrorUnauthorized('User not found');
                const password = Buffer.from(body.password, 'hex').toString();

                if (!user.is_active) throw ErrorUnauthorized('User is not active');

                if (password !== Buffer.from(user.authorization.password, 'hex').toString())
                    throw ErrorUnauthorized('Password incorrect');

                resolve({
                    token_type: config.tokenType,
                    access_token: jwt.sign({ user_id: user.user_id }, config.secret, { expiresIn: config.accessTokenExpiresIn }),
                    refresh_token: jwt.sign({ user_id: user.user_id }, config.secret, { expiresIn: config.refreshTokenExpiresIn })
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    refreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            try {
                const decoded = jwt.verify(refreshToken, config.secret, (err, decoded) => {
                    if (err) {
                        throw ErrorUnauthorized(err.message);
                    }
                    return decoded;
                });

                const user = await users.findByPk(decoded.user_id);

                if (!user) throw ErrorNotFound('User not found');

                if (!user.is_active) throw ErrorUnauthorized('User is not active');

                resolve({
                    token_type: config.tokenType,
                    access_token: jwt.sign({ user_id: user.user_id }, config.secret, { expiresIn: config.accessTokenExpiresIn }),
                    refresh_token: jwt.sign({ user_id: user.user_id }, config.secret, { expiresIn: config.refreshTokenExpiresIn })
                });
            } catch (error) {
                reject(error);
            }
        });
    },
};

module.exports = { ...methods };
