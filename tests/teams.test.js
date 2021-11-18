const request = require("supertest");
const app = require("../index");

describe("Create team /teams", () => {
  it("it should create teams success", () => {
    return request(app)
      .post("/api/v1/teams")
      .send({
        user_id: '61967f57e70eb64a255be903',
        name: 'Team-A'
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        console.log(response.body.data.teams)
      })
  });

  it("it should create teams failure", () => {
    return request(app)
      .post("/api/v1/teams")
      .send({
       
      })
      .expect("Content-Type", /json/)
      .expect(403);
  });
});
