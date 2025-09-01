// backend/tests/createNewHike.test.js
const { CreateNewHike } = require("../hikeData/CreateNewHike.js");
const { createClient } = require("@supabase/supabase-js");

jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  return {
    createClient: () => ({
      from: mockFrom,
      __mockFrom: mockFrom,
    }),
  };
});

const { __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

// Helper functions
const mockRequest = (body = {}, query = {}) => ({
  body,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CreateNewHike Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new hike successfully", async () => {
    const reqBody = {
      userid: 1,
      startdate: "2025-09-01",
      enddate: "2025-09-02",
      location: "Mountain Trail",
      weather: "Sunny",
      elevation: "3,200 ft",
      status: "Planned",
      distance: "12.2 miles",
      hikinggroup: "Friends",
      difficulty: "Moderate",
      title: "Morning Hike",
      route: "Route A",
    };

    mockFrom.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [reqBody],
        error: null,
      }),
    });

    const req = mockRequest(reqBody);
    const res = mockResponse();

    await CreateNewHike(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "successfully created new hike",
      hike: reqBody,
    });
  });

  it("should handle Supabase insert error", async () => {
    const reqBody = {
      userid: 1,
      startdate: "2025-09-01",
      enddate: "2025-09-02",
      location: "Mountain Trail",
      weather: "Sunny",
      elevation: "3,200 ft",
      status: "Planned",
      distance: "12.2 miles",
      hikinggroup: "Friends",
      difficulty: "Moderate",
      title: "Morning Hike",
      route: "Route A",
    };

    mockFrom.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      }),
    });

    const req = mockRequest(reqBody);
    const res = mockResponse();

    await CreateNewHike(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Insert failed" });
  });

  it("should handle unexpected errors", async () => {
    const reqBody = {
      userid: 1,
      startdate: "2025-09-01",
      enddate: "2025-09-02",
      location: "Mountain Trail",
      weather: "Sunny",
      elevation: "3,200 ft",
      status: "Planned",
      distance: "12.2 miles",
      hikinggroup: "Friends",
      difficulty: "Moderate",
      title: "Morning Hike",
      route: "Route A",
    };

    // Force insert to throw
    mockFrom.mockReturnValue({
      insert: jest.fn(() => { throw new Error("Unexpected DB error"); }),
      select: jest.fn(),
    });

    const req = mockRequest(reqBody);
    const res = mockResponse();

    await CreateNewHike(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Unexpected DB error" });
  });
});
