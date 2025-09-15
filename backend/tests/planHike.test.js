// backend/tests/hikesController.test.js
const {
  fetchCompletedHikes,
  fetchCurrentHike,
  fetchPlannedHikes,
  fetchAllHikes,
  fetchHike,
  editPlannedHike,
  deletePlannedHike
} = require("../hikeData/plannedHikes_details.js");

jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  const chainable = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };
  mockFrom.mockReturnValue(chainable);
  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
      __mockFrom: mockFrom,
    })),
  };
});

const { __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

const mockRequest = (query = {}, params = {}, body = {}) => ({ query, params, body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Hikes Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  // ---------------- fetchPlannedHikes ----------------
  describe("fetchPlannedHikes", () => {
    it("should return planned hikes successfully", async () => {
      const mockData = [
        { hikeid: 1, startdate: "2025-09-15T10:00:00Z", location: "Yosemite", status: "planned", hikinggroup: { members: [1,2] } }
      ];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null })
      });

      const req = mockRequest({ userid: 123 });
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.data[0]).toMatchObject({ id: 1, location: "Yosemite", attendees: 3 });
      expect(response.data[0].image).toContain("yosemite");
    });

    it("should return 400 if userid is missing", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("should handle Supabase errors", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: "DB error" } })
      });

      const req = mockRequest({ userid: 123 });
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  // Other controller tests remain the same but you may need to **mock each chain fully** like above for `select().eq()`, `update().eq().select()`, etc.

});
