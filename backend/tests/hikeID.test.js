const request = require("supertest");
const app = require("../server.js"); // your Express app

// Mock the Supabase client
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn((column, value) => {
          // column = 'userid', value = req.params.userid
          return {
            is: jest.fn(() => {
              // Simulate database scenarios
              if (value === "1") {
                // User 1 has hikes
                return {
                  data: [{ hikeid: "H12345" }, { hikeid: "H67890" }],
                  error: null,
                };
              } else if (value === "9999") {
                // User 9999 has no hikes
                return { data: [], error: null };
              } else if (value === "error") {
                // Simulate DB error
                return { data: null, error: { message: "Database error!" } };
              } else {
                // Default empty
                return { data: [], error: null };
              }
            }),
          };
        }),
      })),
    })),
  })),
}));

describe("GET /userHikeId/:userid", () => {
  it("should fetch all hikes for a valid user", async () => {
    const response = await request(app).get("/userHikeId/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Fetched all hikes for user");
    expect(response.body.hikes).toEqual([{ hikeid: "H12345" }, { hikeid: "H67890" }]);
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
