const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const conn = require("../models");

const methods = {
  create(data) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      const { user_id, name } = data;
      try {
        session.startTransaction();
        const team = new Teams({
          name,
          members: [
            {
              user_id,
              role: "ADMIN",
              permission_cmd: "CRUD",
            },
          ],
          created_by: user_id,
        });

        await team.save();

        const user = await Users.findByIdAndUpdate(
          user_id,
          { $addToSet: { teams: team._id } },
          { session, new: true }
        ).populate({ path: "teams", select: "name code" });

        await session.commitTransaction();

        resolve({
          ...team._doc,
          teams: user.teams,
        });
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      }
      session.endSession();
    });
  },
};

module.exports = { ...methods };
