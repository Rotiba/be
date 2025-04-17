const request = require("supertest");
const app = require("../index");

describe("Rating Endpoints", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    token = res.body.token;
  });

  it("should add a rating to a video", async () => {
    const res = await request(app)
      .post("/api/videos/1/ratings")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Rating submitted successfully");
  });

  it("should fetch ratings for a video", async () => {
    const res = await request(app).get("/api/videos/1/ratings");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("averageRating");
    expect(res.body).toHaveProperty("ratingCount");
  });
});
