const request = require("supertest");
const app = require("../server.js");

describe("Weather API", () => {
  // Mock fetch before all tests
  beforeAll(() => {
    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: [
              { temp: 20, weather: "Sunny" },
              { temp: 21, weather: "Cloudy" },
            ],
          }),
      })
    );
  });

  // Restore fetch after all tests
  afterAll(() => {
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  it("should return weather data for Johannesburg", async () => {
    const res = await request(app)
      .get("/api/weather/forecast?lat=-26.2041&lon=28.0473");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("daily");
    expect(Array.isArray(res.body.daily)).toBe(true);
  });

  it("should handle missing query parameters gracefully", async () => {
    const res = await request(app)
      .get("/api/weather/forecast");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 500 when fetch fails", async () => {
    // Override fetch to simulate a network error
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const res = await request(app)
      .get("/api/weather/forecast?lat=-26.2041&lon=28.0473");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Error fetching weather data");
  });
});
