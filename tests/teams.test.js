const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
// medel
const Users = mongoose.model("Users");
const Teams = mongoose.model("Teams");
const Permissions = mongoose.model("Permissions");

// service
const { createTeam } = require("../services/team.service");

function random() {
  return Math.floor(100000 + Math.random() * 900000);
}
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
        first_name: random(),
        last_name: random(),
      });
    });

    it("it should create teams success", async () => {
      return request(app)
        .post("/api/v1/teams")
        .send({
          user_id: user._id,
          name: random(),
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
        first_name: random(),
        last_name: random(),
      });

      user = await Users.create({
        first_name: random(),
        last_name: random(),
      });

      team = await createTeam({
        user_id: owner._id,
        name: random(),
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
        .send()
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
});
