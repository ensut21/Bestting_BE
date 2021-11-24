const mongoose = require("mongoose");
const Users = mongoose.model("Users");

const methods = {
  getUserAll(query) {
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
  createUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Users.create(data);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  getUserById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await Users.findById(id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  updateUser(id, data) {
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
