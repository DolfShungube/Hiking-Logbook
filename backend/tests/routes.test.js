// backend/tests/routeController.test.js
const { getRoute, getAllRoutes } = require("../routes/routes.controller.js");

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
      __mockFrom: mockFrom,
    })),
  };
});

const { __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

// Helpers to mock req/res
const mockRequest = (query = {}) => ({ query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Route Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------- getRoute -------------------
  describe("getRoute", () => {
    it("should return route successfully", async () => {
      const mockData = [{ routeid: 10, name: "Trail 1" }];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const req = mockRequest({ routeid: 10 });
      const res = mockResponse();

      await getRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it("should return 500 if Supabase returns an error", async () => {
      const statusError = { message: "Failed to fetch route" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: statusError }),
      });

      const req = mockRequest({ routeid: 10 });
      const res = mockResponse();

      await getRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch route" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected exception"); });

      const req = mockRequest({ routeid: 10 });
      const res = mockResponse();

      await getRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------- getAllRoutes -------------------
  describe("getAllRoutes", () => {
    it("should return all routes successfully", async () => {
      const mockData = [
        { routeid: 1, name: "Trail A" },
        { routeid: 2, name: "Trail B" },
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const req = mockRequest();
      const res = mockResponse();

      await getAllRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it("should return 500 if Supabase returns an error", async () => {
      const statusError = { message: "Failed to fetch all routes" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: statusError }),
      });

      const req = mockRequest();
      const res = mockResponse();

      await getAllRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch all routes" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected crash"); });

      const req = mockRequest();
      const res = mockResponse();

      await getAllRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });
});
