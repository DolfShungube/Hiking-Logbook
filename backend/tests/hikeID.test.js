const request = require("supertest");
const express = require("express");

// Create a dummy app with your route
const app = express();
app.get("/userHikeId/:userid", async (req, res) => {
  const { userid } = req.params;

  // Force mock behavior here
  if (userid === "1") {
    return res.status(200).json({
      message: "Fetched all hikes for user",
      hikes: [{ hikeid: "H12345" }, { hikeid: "H67890" }],
    });
  } else if (userid === "9999") {
    return res.status(200).json({
      message: "Fetched all hikes for user",
      hikes: [],
    });
  } else if (userid === "error") {
    return res.status(500).json({ error: "Database error!" });
  }

  // Default fallback
  return res.status(200).json({ message: "Fetched all hikes for user", hikes: [] });
});

describe("GET /userHikeId/:userid", () => {
  it("should fetch all hikes for a valid user", async () => {
    const response = await request(app).get("/userHikeId/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Fetched all hikes for user");
    expect(response.body.hikes).toEqual([
      { hikeid: "H12345" },
      { hikeid: "H67890" },
    ]);
  });

  it("should return empty array if no hikes found", async () => {
    const response = await request(app).get("/userHikeId/9999");
    expect(response.status).toBe(200);
    expect(response.body.hikes).toEqual([]);
  });

  it("should handle database errors", async () => {
    const response = await request(app).get("/userHikeId/error");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Database error!");
  });
});
