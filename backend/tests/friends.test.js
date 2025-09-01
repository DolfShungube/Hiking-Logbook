// backend/tests/friends.test.js
const { inviteFriend, acceptInvite, rejectInvite, getFriends } = require("../friends/friends.controller.js")

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const mockRpc = jest.fn();
  const mockFrom = jest.fn();
  return {
    createClient: () => ({
      rpc: mockRpc,
      from: mockFrom,
      __mockRpc: mockRpc,
      __mockFrom: mockFrom,
    }),
  };
});

// Helper to mock request and response objects
const mockRequest = (body = {}, query = {}) => ({ body, query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Access the mocks from the mocked module
const { __mockRpc: mockRpc, __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

describe("Friend Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------- inviteFriend --------------------
  describe("inviteFriend", () => {
    it("should send friend invite successfully", async () => {
      mockRpc.mockResolvedValueOnce({ data: "sent", error: null });
      mockRpc.mockResolvedValueOnce({ data: "received", error: null });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await inviteFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Friend invite sent successfully" });
    });

    it("should handle RPC error when sending invite", async () => {
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "RPC failed" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await inviteFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "RPC failed" });
    });

    it("should handle RPC error when receiving invite", async () => {
      mockRpc.mockResolvedValueOnce({ data: "sent", error: null });
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Receive failed" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await inviteFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Receive failed" });
    });

    // -------------------- catch block coverage --------------------
    it("should handle unexpected errors (lines 39-40)", async () => {
      mockRpc.mockImplementationOnce(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await inviteFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // -------------------- acceptInvite --------------------
  describe("acceptInvite", () => {
    it("should accept invite successfully", async () => {
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await acceptInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Friend accepted successfully" });
    });

    it("should handle RPC error on first update", async () => {
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Update failed" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await acceptInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
    });

    it("should handle RPC error on second update", async () => {
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Update failed 2" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await acceptInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed 2" });
    });

    // -------------------- catch block coverage --------------------
    it("should handle unexpected errors (lines 68-69)", async () => {
      mockRpc.mockImplementationOnce(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await acceptInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // -------------------- rejectInvite --------------------
  describe("rejectInvite", () => {
    it("should reject invite successfully", async () => {
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await rejectInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Friend rejected successfully" });
    });

    it("should handle RPC error on first reject", async () => {
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Reject failed" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await rejectInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Reject failed" });
    });

    it("should handle RPC error on second reject", async () => {
      mockRpc.mockResolvedValueOnce({ data: "ok", error: null });
      mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Reject failed 2" } });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await rejectInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Reject failed 2" });
    });

    // -------------------- catch block coverage --------------------
    it("should handle unexpected errors (lines 98-99)", async () => {
      mockRpc.mockImplementationOnce(() => { throw new Error("Unexpected"); });

      const req = mockRequest({ userid: 1, friendid: 2 });
      const res = mockResponse();

      await rejectInvite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });

  // -------------------- getFriends --------------------
  describe("getFriends", () => {
    it("should return friend list successfully", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { friendlist: { friends: ["a"] } }, error: null }),
      });

      const req = mockRequest({}, { userid: 1 });
      const res = mockResponse();

      await getFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ friend_list: { friends: ["a"] } });
    });

    it("should handle error when fetching friends", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "Fetch failed" } }),
      });

      const req = mockRequest({}, { userid: 1 });
      const res = mockResponse();

      await getFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Fetch failed" });
    });

    it("should handle empty friendlist gracefully", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: {}, error: null }),
      });

      const req = mockRequest({}, { userid: 1 });
      const res = mockResponse();

      await getFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ friend_list: { friends: [], invitessent: [], invitesreceived: [] } });
    });

    // -------------------- catch block coverage --------------------
    it("should handle unexpected errors (lines 121-122)", async () => {
      mockFrom.mockImplementationOnce(() => { throw new Error("Unexpected"); });

      const req = mockRequest({}, { userid: 1 });
      const res = mockResponse();

      await getFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });
  });
});
