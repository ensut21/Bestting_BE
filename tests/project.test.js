const request = require("supertest");
const app = require("../index");

const mongoose = require("mongoose");
// model
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Projects = mongoose.model("Projects");
const Permissions = mongoose.model("Permissions");

// service
const { createTeam, addTeamMembers } = require("../services/team.service");
const {
  createProject,
  addProjectMembers,
} = require("../services/project.service");

const { randomSixDigit } = require("../utils/common");

describe("Feature project api", function () {
  afterAll(async () => {
    await Users.remove();
    await Teams.remove();
    await Permissions.remove();
    await Projects.remove();
  });

  describe("Get project by id /project/:projectId", function () {
    let owner, team, project;

    beforeAll(async () => {
      const { ownerData, teamData } = await init();
      owner = ownerData;
      team = teamData;

      project = await createProject({
        user_id: owner._id,
        team_id: team._id,
        name: randomSixDigit(),
      });
    });

    it("it should get project by id success", async () => {
      return request(app)
        .get(`/api/v1/projects/${project._id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data).not.toEqual(null);
        });
    });

    // it("it should get project by id failure case user is not in a team", async () => {

    // })
  });

  describe("Create project /project", function () {
    let owner, team;

    beforeAll(async () => {
      const { ownerData, teamData } = await init();
      owner = ownerData;
      team = teamData;
    });

    it("it should create project success", async () => {
      return request(app)
        .post("/api/v1/projects")
        .send({
          user_id: owner._id,
          team_id: team._id,
          name: randomSixDigit(),
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then(async (response) => {
          const teamExpect = await Teams.findById(team._id);
          const permissionExpect = await Permissions.findOne({
            user_id: owner._id,
            team_id: team._id,
            project_id: response.body.data._id,
          });
          expect(permissionExpect).not.toEqual(null);
          expect(teamExpect.projects.length).toEqual(1);
          expect(teamExpect.projects[0].toString()).toEqual(
            response.body.data._id.toString()
          );
          expect(response.body.data.team_id.toString()).toEqual(
            team._id.toString()
          );
          expect(response.body.data.members.length).toEqual(1);
          expect(response.body.data.created_by.toString()).toEqual(
            owner._id.toString()
          );
        });
    });

    it("it should create project failure case team not found", async () => {
      return request(app)
        .post("/api/v1/projects")
        .send({
          user_id: owner._id,
          team_id: "619e4478261646e2b98016b7",
          name: randomSixDigit(),
        })
        .expect("Content-Type", /json/)
        .expect(404)
        .then(async (response) => {
          expect(response.body.errorMessage).toEqual("Team not found.");
        });
    });
  });

  describe("Delete project by id /project/:projectId", function () {
    let owner, team, project;

    beforeAll(async () => {
      const { ownerData, teamData } = await init();
      owner = ownerData;
      team = teamData;

      project = await createProject({
        user_id: owner._id,
        team_id: team._id,
        name: randomSixDigit(),
      });
    });

    it("it should delete project success", function () {
      return request(app)
        .delete(`/api/v1/projects/${project._id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const teamUpdated = await Teams.findById(team._id);
          expect(teamUpdated.projects.length).toEqual(0);
          expect(response.body.data.terminated_at).not.toEqual(null);
        });
    });
  });

  describe("Add project members /project/:projectId/members", function () {
    let owner, user, team, project, roleId;

    beforeAll(async () => {
      const { ownerData, userData, teamData, roleIdData } = await init();
      owner = ownerData;
      user = userData;
      team = teamData;
      roleId = roleIdData;

      project = await createProject({
        user_id: owner._id,
        team_id: team._id,
        name: randomSixDigit(),
      });
    });

    it("it should add project members success", function () {
      return request(app)
        .patch(`/api/v1/projects/${project._id}/members`)
        .send([
          {
            user_id: user._id,
            role_id: roleId,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const permission = Permissions.findOne({
            user_id: user._id,
            team_id: team._id,
            project_id: project._id,
            terminated_at: null,
          });
          expect(permission).not.toEqual(null);
          expect(
            response.body.data.members.includes(user._id.toString())
          ).toEqual(true);
        });
    });

    it("it should add project members failure case missing invalid", function () {
      return request(app)
        .patch(`/api/v1/projects/${project._id}/members`)
        .expect("Content-Type", /json/)
        .expect(403);
    });

    it("it should add project members failure case user is not in a team", function () {
      return request(app)
        .patch(`/api/v1/projects/${project._id}/members`)
        .send([
          {
            user_id: "619fb0986da67b4bd06ae972",
            role_id: roleId,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(403);
    });
  });

  describe("Remove project members /project/:projectId/members/:userId", function () {
    let owner, user, team, project;

    beforeAll(async () => {
      const { ownerData, userData, teamData, roleIdData } = await init();
      owner = ownerData;
      user = userData;
      team = teamData;

      project = await createProject({
        user_id: owner._id,
        team_id: team._id,
        name: randomSixDigit(),
      });

      await addProjectMembers(
        project._id,
        [user._id],
        [{ user_id: user._id, role_id: roleIdData }]
      );
    });

    it("it should remove project members success", function () {
      return request(app)
        .delete(`/api/v1/projects/${project._id}/members/${user._id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const permission = await Permissions.findOne({
            user_id: user._id,
            team_id: team._id,
            project_id: project._id,
            terminated_at: null,
          });
          expect(permission).toEqual(null);
          expect(response.body.data.members.includes(user._id)).toEqual(false);
        });
    });
  });
});

async function init() {
  const roleIdData = "619a0af26ebc6ababd887683";

  const ownerData = await Users.create({
    first_name: randomSixDigit(),
    last_name: randomSixDigit(),
  });

  const userData = await Users.create({
    first_name: randomSixDigit(),
    last_name: randomSixDigit(),
  });

  const teamData = await createTeam({
    user_id: ownerData._id,
    name: randomSixDigit(),
  });

  await addTeamMembers(
    teamData._id,
    [userData._id],
    [{ user_id: userData._id, role_id: roleIdData }]
  );

  return { ownerData, userData, teamData, roleIdData };
}
