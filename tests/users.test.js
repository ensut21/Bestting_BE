const request = require("supertest");
const app = require("../index");

describe("Get /users", () => {
  it("it should GET /users success", () => {
    return request(app)
      .get("/api/v1/users")
      .expect("Content-Type", /json/)
      .expect(200)
  });
});

describe("Get /users/:id", () => {
  it("it should GET /users/:id success", () => {
    return request(app)
      .get("/api/v1/users/61964c9e604bfcf837d8915c")
      .expect(200)
  });
});

describe("POST /users", () => {
  it("it should POST /users success", () => {
    return request(app)
      .post("/api/v1/users")
      .send({
        first_name: "nsd_test1",
        last_name: "nsd_test1",
      })
      .expect("Content-Type", /json/)
      .expect(201);
  });
});

describe("Patch /users/:id", () => {
  it("it should PATCH /users/:id success", () => {
    return request(app)
      .patch("/api/v1/users/61964c9e604bfcf837d8915c")
      .send({
        first_name: "ทดสอบ-5",
        last_name: "ทดสอบ",
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
