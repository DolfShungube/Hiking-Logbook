// backend/tests/hikeController.test.js
const {
  fetchCompletedHikes,
  fetchCurrentHike,
  fetchPlannedHikes,
  fetchHike,
  editPlannedHike,
  deletePlannedHike,
} = require("../hikeData/hikes.controller.js");

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

const mockRequest = (query = {}, body = {}, params = {}) => ({
  query,
  body,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Hike Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------ fetchCompletedHikes ------------------
  describe("fetchCompletedHikes", () => {
    it("should fetch completed hikes successfully", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: [{ hikeid: 1 }], error: null })),
      });

      const req = mockRequest({ userid: 1 });
      const res = mockResponse();

      await fetchCompletedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "completed hikes fetched successfully",
        data: [{ hikeid: 1 }],
      });
    });

    it("should handle Supabase error", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: null, error: { message: "Failed" } })),
      });

      const req = mockRequest({ userid: 1 });
      const res = mockResponse();

      await fetchCompletedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 1 });
      const res = mockResponse();

      await fetchCompletedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------ fetchCurrentHike ------------------
  describe("fetchCurrentHike", () => {
    it("should fetch current hike successfully", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: [{ hikeid: 2 }], error: null })),
      });

      const req = mockRequest({ userid: 2 });
      const res = mockResponse();

      await fetchCurrentHike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "current hike fetched successfully",
        data: [{ hikeid: 2 }],
      });
    });

    it("should handle Supabase error", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: null, error: { message: "Something went wrong" } })),
      });

      const req = mockRequest({ userid: 2 });
      const res = mockResponse();

      await fetchCurrentHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 2 });
      const res = mockResponse();

      await fetchCurrentHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------ fetchPlannedHikes ------------------
  describe("fetchPlannedHikes", () => {
    it("should fetch planned hikes successfully", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: [{ hikeid: 3 }], error: null })),
      });

      const req = mockRequest({ userid: 3 });
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "planned hikes fetched successfully",
        data: [{ hikeid: 3 }],
      });
    });

    it("should handle Supabase error", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: null, error: { message: "Fail" } })),
      });

      const req = mockRequest({ userid: 3 });
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 3 });
      const res = mockResponse();

      await fetchPlannedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------ fetchHike ------------------
  describe("fetchHike", () => {
    it("should fetch hike by hikeid", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: [{ hikeid: 10 }], error: null })),
      });

      const req = mockRequest({ hikeid: 10 });
      const res = mockResponse();

      await fetchHike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "current hike fetched successfully",
        data: [{ hikeid: 10 }],
      });
    });

    it("should handle Supabase error", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn(cb => cb({ data: null, error: { message: "Error" } })),
      });

      const req = mockRequest({ hikeid: 10 });
      const res = mockResponse();

      await fetchHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ hikeid: 10 });
      const res = mockResponse();

      await fetchHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------ editPlannedHike ------------------
  describe("editPlannedHike", () => {
    it("should update hike successfully", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { hikeid: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: [{ hikeid: 1, location: "New Place" }], error: null }),
        });

      const req = mockRequest({}, { location: "New Place" }, { hikeId: 1 });
      const res = mockResponse();

      await editPlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Hike updated successfully",
        hike: { hikeid: 1, location: "New Place" },
      });
    });

    it("should return 404 if hike not found", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const req = mockRequest({}, { location: "New Place" }, { hikeId: 99 });
      const res = mockResponse();

      await editPlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Hike not found" });
    });

    it("should handle Supabase update error", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { hikeid: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: null, error: { message: "Update failed" } }),
        });

      const req = mockRequest({}, { location: "New Place" }, { hikeId: 1 });
      const res = mockResponse();

      await editPlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({}, { location: "New Place" }, { hikeId: 1 });
      const res = mockResponse();

      await editPlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // ------------------ deletePlannedHike ------------------
  describe("deletePlannedHike", () => {
    it("should delete hike successfully", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { hikeid: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn(cb => cb({ error: null })),
        });

      const req = mockRequest({}, {}, { hikeId: 1 });
      const res = mockResponse();

      await deletePlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Hike deleted successfully",
        deletedHikeId: 1,
      });
    });

    it("should return 404 if hike not found", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const req = mockRequest({}, {}, { hikeId: 99 });
      const res = mockResponse();

      await deletePlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Hike not found" });
    });

    it("should handle Supabase delete error", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { hikeid: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          then: jest.fn(cb => cb({ error: { message: "Delete failed" } })),
        });

      const req = mockRequest({}, {}, { hikeId: 1 });
      const res = mockResponse();

      await deletePlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected"); });

      const req = mockRequest({}, {}, { hikeId: 1 });
      const res = mockResponse();

      await deletePlannedHike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });
});
