const request = require("supertest");
const app = require("../server.js");

describe("Weather API", () => {
  it("should return weather data for Johannesburg", async () => {
    const res = await request(app)
      .get("/api/weather/forecast?lat=-26.2041&lon=28.0473");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("daily"); // daily forecast exists
    expect(Array.isArray(res.body.daily)).toBe(true);
  });

  it("should handle missing query parameters gracefully", async () => {
    const res = await request(app)
      .get("/api/weather/forecast");

    // You can choose 400 or 500 depending on your route logic
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 500 when fetch fails",async ()=>{

    //mock global fetch to simulate an error 
    //Overrides the normal fetch call and forces it to fail
    global.fetch=jest.fn(()=> Promise.reject(new Error("Network error")));

    const res= await request(app).get("/api/weather/forecast?lat=-26.2041&lon=28.0473");

    expect(res.statusCode).toBe(500); // catch block triggers
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Error fetching weather data");

    // Restore fetch to original
    global.fetch.mockRestore && global.fetch.mockRestore();
  });
});
