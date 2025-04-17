const request = require("supertest");
const app = require("../index");

describe("Comment Endpoints", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    token = res.body.token;
  });

  it("should add a comment to a video", async () => {
    const res = await request(app)
      .post("/api/videos/1/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Great video!" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Comment added successfully");
  });

  it("should fetch comments for a video", async () => {
    const res = await request(app).get("/api/videos/1/comments");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
