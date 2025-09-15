// backend/tests/notesController.test.js
const { getNotes, addNotes, removeNotes } = require("../notes/notes.controller.js");

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  const mockRpc = jest.fn();
  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
      rpc: mockRpc,
      __mockFrom: mockFrom,
      __mockRpc: mockRpc,
    })),
  };
});

// Access mocks
const { __mockFrom: mockFrom, __mockRpc: mockRpc } = require("@supabase/supabase-js").createClient();

// Helper functions to mock req/res
const mockRequest = (query = {}, body = {}) => ({ query, body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Notes Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- getNotes tests ---
  describe("getNotes", () => {
    it("should return notes successfully", async () => {
      const mockData = [{ noteId: 1, hikeid: 5, content: "Great hike!" }];

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const req = mockRequest({ hikeid: 5 });
      const res = mockResponse();

      await getNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it("should return 500 if Supabase returns an error", async () => {
      const statusError = { message: "Failed to fetch" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: statusError }),
      });

      const req = mockRequest({ hikeid: 5 });
      const res = mockResponse();

      await getNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch" });
    });

    it("should handle unexpected errors (catch block)", async () => {
      mockFrom.mockImplementation(() => { throw new Error("Unexpected exception"); });

      const req = mockRequest({ hikeid: 5 });
      const res = mockResponse();

      await getNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // --- addNotes tests ---
  describe("addNotes", () => {
    it("should add note successfully", async () => {
      const mockData = { noteId: 1, hikeid: 5, content: "Great hike!" };

      mockRpc.mockResolvedValue({ data: mockData, error: null });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!" });
      const res = mockResponse();

      await addNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "added new notes successfully",
        data: mockData,
      });
    });

    it("should return 500 if Supabase RPC returns error", async () => {
      const rpcError = { message: "RPC failed" };
      mockRpc.mockResolvedValue({ data: null, error: rpcError });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!" });
      const res = mockResponse();

      await addNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "RPC failed" });
    });

    it("should handle unexpected errors", async () => {
      mockRpc.mockImplementation(() => { throw new Error("Unexpected RPC error"); });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!" });
      const res = mockResponse();

      await addNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // --- removeNotes tests ---
  describe("removeNotes", () => {
    it("should remove note successfully", async () => {
      const mockData = { noteId: 1, hikeid: 5, content: "Great hike!" };

      mockRpc.mockResolvedValue({ data: mockData, error: null });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15" });
      const res = mockResponse();

      await removeNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "note removed successfully",
        data: mockData,
      });
    });

    it("should return 500 if Supabase RPC returns error", async () => {
      const rpcError = { message: "Remove RPC failed" };
      mockRpc.mockResolvedValue({ data: null, error: rpcError });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15" });
      const res = mockResponse();

      await removeNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Remove RPC failed" });
    });

    it("should handle unexpected errors", async () => {
      mockRpc.mockImplementation(() => { throw new Error("Unexpected RPC error"); });

      const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15" });
      const res = mockResponse();

      await removeNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });
});
