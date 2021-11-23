const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Roles = mongoose.model("Roles");
const Permissions = mongoose.model("Permissions");

const conn = require("../models");
const { ErrorNotFound, ErrorForbidden } = require("../configs/errorMetods");

const methods = {
  getTeamById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        // check user in this team
        const team = Teams.findById(id);

        resolve(team);
      } catch (error) {
        reject(error.message || error);
      }
    });
  },
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
        reject(error.message || error);
      } finally {
        session.endSession();
      }
    });
  },
  deleteTeam(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const team = await Teams.findByIdAndUpdate(
          id,
          {
            terminated_at: Date.now(),
          },
          { new: true }
        );

        // delete sub feature in team.
        resolve(team);
      } catch (error) {
        reject(error.message || error);
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
            filter: {
              user_id: t.user_id,
              team_id: teamId,
              project_id: { $exists: false },
            },
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
          { $addToSet: { members: userIdList }, updated_at: Date.now() },
          { session, new: true }
        );

        if (!team) throw ErrorNotFound("Team not found.");

        await Users.updateMany(
          { _id: { $in: userIdList } },
          { $addToSet: { teams: team._id }, updated_at: Date.now() },
          { session }
        ).populate({ path: "teams", select: "name code" });

        await session.commitTransaction();
        resolve(team);
      } catch (error) {
        await session.abortTransaction();
        reject(error.message || error);
      } finally {
        session.endSession();
      }
    });
  },
  removeTeamMember(teamId, userId) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      try {
        session.startTransaction();

        const user = await Users.findByIdAndUpdate(
          userId,
          { $pull: { teams: teamId }, updated_at: Date.now() },
          { session }
        );

        const permission = await Permissions.findOneAndUpdate(
          {
            user_id: userId,
            team_id: teamId,
            project_id: { $exists: false },
            terminated_at: null,
          },
          {
            updated_at: Date.now(),
            terminated_at: Date.now(),
          },
          {
            session,
          }
        );

        if (!permission) throw ErrorNotFound("User is not on this team.");

        const team = await Teams.findByIdAndUpdate(
          teamId,
          { $pull: { members: userId }, updated_at: Date.now() },
          { session, new: true }
        ).populate({
          path: "members",
          select: "first_name last_name color_code profile_images",
        });

        if (user._id.toString() === team.created_by.toString())
          throw ErrorForbidden("Permission denied.");

        await session.commitTransaction();

        resolve(team);
      } catch (error) {
        await session.abortTransaction();
        reject(error.message || error);
      } finally {
        session.endSession();
      }
    });
  },
};

module.exports = { ...methods };
