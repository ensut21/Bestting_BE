const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
// medel
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Permissions = mongoose.model("Permissions");

// service
const { createTeam, addTeamMembers } = require("../services/team.service");

const { randomSixDigit } = require("../utils/common");

describe("Feature team api", function () {
  afterAll(async () => {
    await Users.remove();
    await Teams.remove();
    await Permissions.remove();
  });

  describe("Create team /teams", function () {
    let user;

    beforeAll(async () => {
      user = await Users.create({
        first_name: randomSixDigit(),
        last_name: randomSixDigit(),
      });
    });

    it("it should create teams success", async () => {
      return request(app)
        .post("/api/v1/teams")
        .send({
          user_id: user._id,
          name: randomSixDigit(),
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const userUpdated = await Users.findById(user._id);
          expect(userUpdated).toBeTruthy();
          expect(userUpdated.teams.length).toEqual(1);
          expect(response.body.data.members.length).toEqual(1);
          expect(response.body.data.members[0]).toEqual(
            userUpdated._id.toString()
          );
          expect(response.body.data._id).toEqual(
            userUpdated.teams[0].toString()
          );
        });
    });

    it("it should create teams failure", async () => {
      return request(app)
        .post("/api/v1/teams")
        .expect("Content-Type", /json/)
        .expect(403);
    });
  });

  describe("Add team members /teams/:teamId/members", function () {
    let owner,
      user,
      team,
      role_id = "619a0af26ebc6ababd887683";

    beforeAll(async () => {
      owner = await Users.create({
        first_name: randomSixDigit(),
        last_name: randomSixDigit(),
      });

      user = await Users.create({
        first_name: randomSixDigit(),
        last_name: randomSixDigit(),
      });

      team = await createTeam({
        user_id: owner._id,
        name: randomSixDigit(),
      });
    });

    it("it should add team members case success", async () => {
      return request(app)
        .patch(`/api/v1/teams/${team._id}/members`)
        .send([
          {
            user_id: user._id,
            role_id,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const userUpdated = await Users.findById(user._id);
          expect(userUpdated).toBeTruthy();
          expect(userUpdated.teams.length).toEqual(1);
          expect(response.body.data.members.length).toEqual(2);
        });
    });

    it("it should add team members case success (duplicate user)", async () => {
      return request(app)
        .patch(`/api/v1/teams/${team._id}/members`)
        .send([
          {
            user_id: user._id,
            role_id,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const userUpdated = await Users.findById(user._id);
          expect(userUpdated.teams.length).toEqual(1);
          expect(response.body.data.members.length).toEqual(2);
        });
    });

    it("it should add team members failure case missing invalid.", async () => {
      return request(app)
        .patch(`/api/v1/teams/${team._id}/members`)
        .send([
          {
            user_id: "ddd",
            role_id: 100,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(403);
    });

    it("it should add team members failure case teams not found.", async () => {
      return request(app)
        .patch("/api/v1/teams/6197b0bea1985ce708bd6fdc/members")
        .send([
          {
            user_id: "6197b0bea1985ce708bd6fdc",
            role_id,
          },
        ])
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          expect(response.body.errorMessage).toEqual("Team not found.");
        });
    });
  });

  describe("Remove team member /teams/:teamId/members/:userId", function () {
    let owner,
      user,
      team,
      role_id = "619a0af26ebc6ababd887683";

    beforeAll(async () => {
      owner = await Users.create({
        first_name: randomSixDigit(),
        last_name: randomSixDigit(),
      });

      user = await Users.create({
        first_name: randomSixDigit(),
        last_name: randomSixDigit(),
      });

      team = await createTeam({
        user_id: owner._id,
        name: randomSixDigit(),
      });

      await addTeamMembers(
        team._id,
        [user._id],
        [{ user_id: user._id, role_id: role_id }]
      );
    });

    it("it should remove team member case success", async () => {
      return request(app)
        .delete(`/api/v1/teams/${team._id}/members/${user._id}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          const userUpdated = await Users.findById(user._id);
          expect(userUpdated.teams.length).toEqual(0);
          expect(response.body.data.members.length).toEqual(1);

          const permissionUpdated = await Permissions.findOne({
            user_id: user._id,
            team_id: team._id,
          });
          expect(permissionUpdated.terminated_at).not.toEqual(null);
        });
    });

    it("it should remove team member failure case user removed", async () => {
      return request(app)
        .delete(`/api/v1/teams/${team._id}/members/${user._id}`)
        .expect("Content-Type", /json/)
        .expect(404)
        .then(async (response) => {
          expect(response.body.errorMessage).toEqual("User is not on this team.");
        });
    });

    it("it should remove team member failure case remove owner", async () => {
      return request(app)
        .delete(`/api/v1/teams/${team._id}/members/${owner._id}`)
        .expect("Content-Type", /json/)
        .expect(403)
        .then(async (response) => {
          expect(response.body.errorMessage).toEqual("Permission denied.");
        });
    });
  });
});
