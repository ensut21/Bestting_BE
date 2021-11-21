const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Roles = mongoose.model("Roles");
const Permissions = mongoose.model("Permissions");

const conn = require("../models");
const { ErrorNotFound } = require("../configs/errorMetods");

const methods = {
  createTeam(data) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      const { user_id, name } = data;

      try {
        session.startTransaction();

        const team = new Teams({
          name,
          members: [user_id],
          created_by: user_id,
        });

        await team.save();

        const role = await Roles.findOne({ name: "ADMIN" });

        const permission = await Permissions.findOneAndUpdate(
          {
            user_id: user_id,
            team_id: team._id,
          },
          {
            user_id: user_id,
            team_id: team._id,
            role_id: role._id,
          },
          {
            session,
            new: true,
            upsert: true,
          }
        );

        const user = await Users.findByIdAndUpdate(
          user_id,
          { $addToSet: { teams: team._id } },
          { session, new: true }
        ).populate({ path: "teams", select: "name code" });

        await session.commitTransaction();

        resolve({
          ...team._doc,
          permission,
          teams: user.teams,
        });
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      } finally {
        session.endSession();
      }
    });
  },
  addTeamMembers(teamId, userIdList, members) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      try {
        session.startTransaction();

        const permissionQuery = members.map((t) => ({
          updateOne: {
            filter: { user_id: t.user_id, team_id: teamId },
            update: {
              user_id: t.user_id,
              team_id: teamId,
              role_id: t.role_id,
            },
            upsert: true,
          },
        }));

        await Permissions.bulkWrite(permissionQuery, {
          ordered: false,
          session,
        });

        const team = await Teams.findByIdAndUpdate(
          teamId,
          { $addToSet: { members: userIdList } },
          { session, new: true }
        );

        if (!team) throw ErrorNotFound("Team not found.");

        await Users.updateMany(
          { _id: { $in: userIdList } },
          { $addToSet: { teams: team._id } },
          { session }
        ).populate({ path: "teams", select: "name code" });

        await session.commitTransaction();
        resolve(team);
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      } finally {
        session.endSession();
      }
    });
  },
};

module.exports = { ...methods };
