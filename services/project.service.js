const mongoose = require("mongoose");
const Teams = mongoose.model("Teams");
const Projects = mongoose.model("Projects");
const Roles = mongoose.model("Roles");
const Permissions = mongoose.model("Permissions");

const conn = require("../models");
const { ErrorNotFound, ErrorForbidden } = require("../configs/errorMetods");

const methods = {
  getProject(query) {},
  getProjectById(projectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const projects = Projects.findById(projectId);
        resolve(projects);
      } catch (error) {
        reject(error);
      }
    });
  },
  createProject(data) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      const { user_id, team_id, name } = data;

      try {
        session.startTransaction();

        const project = new Projects({
          team_id,
          name,
          members: [user_id],
          created_by: user_id,
        });

        await project.save({ session });

        const team = await Teams.findOneAndUpdate(
          {
            _id: team_id,
            terminated_at: null,
          },
          {
            $addToSet: { projects: project._id },
          },
          {
            session,
            new: true,
          }
        );

        if (!team) throw ErrorNotFound("Team not found.");

        const role = await Roles.findOne({ name: "ADMIN" });

        await Permissions.create(
          {
            user_id: user_id,
            team_id: team._id,
            project_id: project._id,
            role_id: role._id,
          },
          { session }
        );

        await session.commitTransaction();

        resolve(project);
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      } finally {
        session.endSession();
      }
    });
  },
  deleteProject(projectId) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();

      try {
        session.startTransaction();

        const project = await Projects.findByIdAndUpdate(
          projectId,
          {
            terminated_at: Date.now(),
          },
          { session, new: true }
        );

        if (!project) throw ErrorNotFound("Project not found.");

        await Teams.updateOne(
          { _id: project.team_id },
          { $pull: { projects: project._id } },
          { session: session }
        );
        //   console.log(project)
        await session.commitTransaction();

        resolve(project);
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      } finally {
        session.endSession();
      }
    });
  },
  addProjectMembers(projectId, userIdList, members) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();

      try {
        session.startTransaction();

        const project = await Projects.findByIdAndUpdate(
          projectId,
          { $addToSet: { members: userIdList }, updated_at: Date.now() },
          { session, new: true }
        );

        if (!project) throw ErrorNotFound("Project not found.");

        const team = await Teams.findOne({
          _id: project.team_id,
          members: { $in: userIdList },
          terminated_at: null,
        });

        if (!team) throw ErrorForbidden("User is not in a team.");

        const permissionQuery = members.map((t) => ({
          updateOne: {
            filter: {
              user_id: t.user_id,
              team_id: team._id,
              project_id: project._id,
              terminated_at: null,
            },
            update: {
              user_id: t.user_id,
              team_id: team._id,
              project_id: project._id,
              role_id: t.role_id,
            },
            upsert: true,
          },
        }));

        await Permissions.bulkWrite(permissionQuery, {
          ordered: false,
          session,
        });

        await session.commitTransaction();

        resolve(project);
      } catch (error) {
        await session.abortTransaction();
        reject(error);
      } finally {
        session.endSession();
      }
    });
  },
  removeProjectMembers(projectId, userId) {
    return new Promise(async (resolve, reject) => {
      const session = await conn.startSession();
      try {
        session.startTransaction();

        const project = await Projects.findByIdAndUpdate(
          projectId,
          { $pull: { members: userId }, updated_at: Date.now() },
          { session, new: true }
        );

        if (!project) throw ErrorNotFound("Project not found.");

        const permission = await Permissions.findOneAndUpdate(
          {
            user_id: userId,
            team_id: project.team_id,
            project_id: project._id,
            terminated_at: null,
          },
          {
            updated_at: Date.now(),
            terminated_at: Date.now(),
          },
          {
            session,
            new: true,
          }
        );

        if (!permission) throw ErrorForbidden("User is not in a team.");

        await session.commitTransaction();

        resolve(project);
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
