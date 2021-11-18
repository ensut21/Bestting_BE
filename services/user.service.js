const mongoose = require("mongoose");
const Users = mongoose.model("Users");

const methods = {
  findAll(query) {
    const { limit, skip, sort } = query;
    return new Promise(async (resolve, reject) => {
      try {
        const users = await Users.find()
          .limit(limit ? parseInt(limit) : null)
          .skip(skip ? parseInt(skip) : null)
          .sort(sort);
        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  },
  create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Users.create(data);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Users.findById(id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Users.findByIdAndUpdate(
          id,
          { $set: data },
          {
            new: true,
          }
        );
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
