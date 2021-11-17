const request = require("supertest");

const app = require("../index");

describe("POST /users", () => {
  it("it should POST /users success", () => {
    return request(app)
      .post("/api/v1/users")
      .send({
        first_name: "nsd_test1",
        last_name: "nsd_test1",
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Get /users/:id", () => {
  it("it should POST /users/:id success", () => {
    return request(app)
      .get("/api/v1/users/61952914743708c9b47ea233")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
