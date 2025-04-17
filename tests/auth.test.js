const request = require("supertest");
const app = require("../index");

describe("Authentication Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
      role: "consumer",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("User registered successfully");
  });

  it("should not register a user with an existing username", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
      role: "consumer",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Username already exists");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Invalid credentials");
  });
});
