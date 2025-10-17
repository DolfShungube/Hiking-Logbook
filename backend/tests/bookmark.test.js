// Create mock functions FIRST
let mockFrom = jest.fn();

// Mock Supabase BEFORE importing the controller
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: (...args) => mockFrom(...args),
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }))
}));

// NOW import the controller
const { addBookmark, removeBookmark, fetchBookmarkedHikes } = require("../hikeData/Bookmark.controller");

// Helper to create mock req/res
const createMockReqRes = (body = {}, params = {}, query = {}) => {
  const req = { body, params, query };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
};

describe("Bookmark controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReset();
  });

  describe("addBookmark", () => {
    it("should return 400 if hikeid or userid is missing", async () => {
      const { req, res } = createMockReqRes({ hikeid: 1 });
      await addBookmark(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Both hikeid and userid are required" });
    });

    it("should return 409 if bookmark already exists", async () => {
      const { req, res } = createMockReqRes({ hikeid: 1, userid: 1 });

      // Setup chain: from().select().eq().eq()
      const mockEq2 = jest.fn().mockResolvedValue({ 
        data: [{ hikeid: 1, userid: 1 }], 
        error: null 
      });
      
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      mockFrom.mockReturnValue({ select: mockSelect });

      await addBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Hike is already bookmarked" });
    });

    it("should add a bookmark successfully", async () => {
      const { req, res } = createMockReqRes({ hikeid: 1, userid: 1 });

      // First call: from().select().eq().eq() - no existing bookmark
      const mockEq2First = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockEq1First = jest.fn().mockReturnValue({ eq: mockEq2First });
      const mockSelectFirst = jest.fn().mockReturnValue({ eq: mockEq1First });
      
      // Second call: from().insert().select() - insert success
      const mockSelectSecond = jest.fn().mockResolvedValue({ 
        data: [{ hikeid: 1, userid: 1 }], 
        error: null 
      });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelectSecond });
      
      mockFrom
        .mockReturnValueOnce({ select: mockSelectFirst })
        .mockReturnValueOnce({ insert: mockInsert });

      await addBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bookmark added successfully",
        bookmark: { hikeid: 1, userid: 1 },
      });
    });

    it("should return 500 if database insert fails", async () => {
      const { req, res } = createMockReqRes({ hikeid: 1, userid: 1 });

      // First call: no existing bookmark
      const mockEq2First = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockEq1First = jest.fn().mockReturnValue({ eq: mockEq2First });
      const mockSelectFirst = jest.fn().mockReturnValue({ eq: mockEq1First });
      
      // Second call: insert fails
      const mockSelectSecond = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: "Insert failed" } 
      });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelectSecond });
      
      mockFrom
        .mockReturnValueOnce({ select: mockSelectFirst })
        .mockReturnValueOnce({ insert: mockInsert });

      await addBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Insert failed" });
    });

    it("should handle unexpected errors", async () => {
      const { req, res } = createMockReqRes({ hikeid: 1, userid: 1 });

      mockFrom.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await addBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  describe("removeBookmark", () => {
    it("should return 400 if hikeid or userid is missing", async () => {
      const { req, res } = createMockReqRes({}, { userid: 1 });
      await removeBookmark(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Both hikeid and userid are required" });
    });

    it("should return 404 if bookmark does not exist", async () => {
      const { req, res } = createMockReqRes({}, { hikeid: 1, userid: 1 });

      // Setup chain: from().select().eq().eq().single()
      const mockSingle = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: "Not found" } 
      });
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      mockFrom.mockReturnValue({ select: mockSelect });

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Bookmark not found" });
    });

    it("should delete a bookmark successfully", async () => {
      const { req, res } = createMockReqRes({}, { hikeid: 1, userid: 1 });

      // First call: from().select().eq().eq().single() - bookmark exists
      const mockSingle = jest.fn().mockResolvedValue({ 
        data: { hikeid: 1, userid: 1 }, 
        error: null 
      });
      const mockEq2First = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1First = jest.fn().mockReturnValue({ eq: mockEq2First });
      const mockSelectFirst = jest.fn().mockReturnValue({ eq: mockEq1First });
      
      // Second call: from().delete().eq().eq() - delete success
      const mockEq2Second = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEq1Second = jest.fn().mockReturnValue({ eq: mockEq2Second });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1Second });
      
      mockFrom
        .mockReturnValueOnce({ select: mockSelectFirst })
        .mockReturnValueOnce({ delete: mockDelete });

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bookmark removed successfully",
        deletedBookmark: { hikeid: 1, userid: 1 },
      });
    });

    it("should return 500 if database delete fails", async () => {
      const { req, res } = createMockReqRes({}, { hikeid: 1, userid: 1 });

      // First call: bookmark exists
      const mockSingle = jest.fn().mockResolvedValue({ 
        data: { hikeid: 1, userid: 1 }, 
        error: null 
      });
      const mockEq2First = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1First = jest.fn().mockReturnValue({ eq: mockEq2First });
      const mockSelectFirst = jest.fn().mockReturnValue({ eq: mockEq1First });
      
      // Second call: delete fails
      const mockEq2Second = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: "Delete failed" } 
      });
      const mockEq1Second = jest.fn().mockReturnValue({ eq: mockEq2Second });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1Second });
      
      mockFrom
        .mockReturnValueOnce({ select: mockSelectFirst })
        .mockReturnValueOnce({ delete: mockDelete });

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });

    it("should handle unexpected errors", async () => {
      const { req, res } = createMockReqRes({}, { hikeid: 1, userid: 1 });

      mockFrom.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  describe("fetchBookmarkedHikes", () => {
    it("should return 400 if userid is missing", async () => {
      const { req, res } = createMockReqRes({}, {}, {});
      await fetchBookmarkedHikes(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "userid is required" });
    });

    it("should fetch bookmarked hikes successfully", async () => {
      const { req, res } = createMockReqRes({}, {}, { userid: 1 });

      const mockData = [
        { hikeid: 1, userid: 1, created_at: "2025-10-17", HikeData: { name: "Hike 1", difficulty: "Easy" } }
      ];

      // Setup chain: from().select().eq()
      const mockEq = jest.fn().mockResolvedValue({ data: mockData, error: null });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      await fetchBookmarkedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bookmarked hikes fetched successfully",
        data: [{ name: "Hike 1", difficulty: "Easy", bookmarked_at: "2025-10-17" }],
      });
    });

    it("should return empty array if user has no bookmarks", async () => {
      const { req, res } = createMockReqRes({}, {}, { userid: 1 });

      const mockEq = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      await fetchBookmarkedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bookmarked hikes fetched successfully",
        data: [],
      });
    });

    it("should return 500 if database query fails", async () => {
      const { req, res } = createMockReqRes({}, {}, { userid: 1 });

      const mockEq = jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: "Query failed" } 
      });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      await fetchBookmarkedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Query failed" });
    });

    it("should handle unexpected errors", async () => {
      const { req, res } = createMockReqRes({}, {}, { userid: 1 });

      mockFrom.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await fetchBookmarkedHikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });
});