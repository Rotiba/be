const request = require("supertest");
const app = require("../index");

describe("Video Endpoints", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    token = res.body.token;
  });

  it("should fetch all videos", async () => {
    const res = await request(app).get("/api/videos");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should fetch a specific video by ID", async () => {
    const res = await request(app).get("/api/videos/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("comments");
    expect(res.body).toHaveProperty("averageRating");
  });

  it("should upload a video (creator only)", async () => {
    const res = await request(app)
      .post("/api/videos")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test Video")
      .field("publisher", "Test Publisher")
      .attach("videoFile", Buffer.from("test video content"), "test.mp4");
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Video uploaded successfully");
  });
});
