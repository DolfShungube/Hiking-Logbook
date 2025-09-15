// backend/tests/coordinates.test.js
const { coordinates, fetchUserRoutes } = require("../hikeData/distance.controller.js");

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  return {
    createClient: () => ({
      from: mockFrom,
      __mockFrom: mockFrom,
    }),
  };
});

// Helpers for mocking req/res
const mockRequest = (params = {}, body = {}, query = {}) => ({ params, body, query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Access the mock
const { __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

describe("fetchUserRoutes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should fetch route successfully", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { route: "   route123   " }, error: null,
      }),
    });

    const result = await fetchUserRoutes(1);

    expect(result).toEqual({ route: "route123" });
  });

  it("should throw error when Supabase returns error", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null, error: { message: "DB error" },
      }),
    });

    await expect(fetchUserRoutes(1)).rejects.toThrow("DB error");
  });

  it("should return null when no route found", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await fetchUserRoutes(2);
    expect(result).toBeNull();
  });
});

describe("coordinates controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return coordinates successfully", async () => {
    // fetchUserRoutes returns a route
    mockFrom
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { route: "r1" }, error: null }),
      })
      // fetch path for route
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            path: {
              features: [
                {
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [10, 20, 100],
                      [30, 40, 200],
                    ],
                  },
                },
              ],
            },
            difficulty: "Easy",
          },
          error: null,
        }),
      });

    const req = mockRequest({ userid: 1 });
    const res = mockResponse();

    await coordinates(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Fetched start coordinates successfully",
      start: [10, 20],
      end: [30, 40],
      difficulty: "Easy",
      path: [
        [10, 20],
        [30, 40],
      ],
    });
  });

  it("should handle no route found", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    const req = mockRequest({ userid: 2 });
    const res = mockResponse();

    await coordinates(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No route found for this user" });
  });

  it("should handle Supabase error fetching path", async () => {
    // fetchUserRoutes returns a route
    mockFrom
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { route: "r1" }, error: null }),
      })
      // fetch path fails
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "Path fetch error" } }),
      });

    const req = mockRequest({ userid: 3 });
    const res = mockResponse();

    await coordinates(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Path fetch error" });
  });

  it("should handle unexpected errors", async () => {
    mockFrom.mockImplementationOnce(() => { throw new Error("Unexpected crash"); });

    const req = mockRequest({ userid: 99 });
    const res = mockResponse();

    await coordinates(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
