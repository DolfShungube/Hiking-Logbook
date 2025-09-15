// backend/tests/goals.test.js
const { getGoals, addGoal, updateGoalStatus, removeGoal } = require("../goals/goals.controller.js");

// Mock Supabase client
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = jest.fn();
  const mockRpc = jest.fn();
  return {
    createClient: () => ({
      from: mockFrom,
      rpc: mockRpc,
      __mockFrom: mockFrom,
      __mockRpc: mockRpc,
    }),
  };
});

// Helper functions to mock req/res
const mockRequest = (query = {}, body = {}) => ({ query, body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Access mocks
const { __mockFrom: mockFrom, __mockRpc: mockRpc } =
  require("@supabase/supabase-js").createClient();

describe("getGoals Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return goals successfully", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [{ id: 1, title: "Goal 1" }], error: null }),
    });

    const req = mockRequest({ hikeid: 1 });
    const res = mockResponse();

    await getGoals(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1, title: "Goal 1" }] });
  });

  it("should handle Supabase error", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
    });

    const req = mockRequest({ hikeid: 1 });
    const res = mockResponse();

    await getGoals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });

  it("should handle unexpected errors", async () => {
    mockFrom.mockImplementationOnce(() => {
      throw new Error("Unexpected");
    });

    const req = mockRequest({ hikeid: 1 });
    const res = mockResponse();

    await getGoals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});

describe("addGoal Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add goal successfully", async () => {
    mockRpc.mockResolvedValue({ data: { id: 1 }, error: null });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "pending" });
    const res = mockResponse();

    await addGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "added new goal successfully",
      data: { id: 1 },
    });
  });

  it("should handle Supabase error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "pending" });
    const res = mockResponse();

    await addGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "RPC error" });
  });

  it("should handle unexpected errors", async () => {
    mockRpc.mockImplementationOnce(() => {
      throw new Error("Unexpected");
    });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "pending" });
    const res = mockResponse();

    await addGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});

describe("updateGoalStatus Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should update goal status successfully", async () => {
    mockRpc.mockResolvedValue({ data: { updated: true }, error: null });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "done" });
    const res = mockResponse();

    await updateGoalStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "status updated successfully",
      data: { updated: true },
    });
  });

  it("should handle Supabase error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "done" });
    const res = mockResponse();

    await updateGoalStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "RPC error" });
  });

  it("should handle unexpected errors", async () => {
    mockRpc.mockImplementationOnce(() => {
      throw new Error("Unexpected");
    });

    const req = mockRequest({}, { hikeid: 1, goalDiscription: "Test goal", goalStatus: "done" });
    const res = mockResponse();

    await updateGoalStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});

describe("removeGoal Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should remove goal successfully", async () => {
    mockRpc.mockResolvedValue({ data: { removed: true }, error: null });

    const req = mockRequest({}, { hikeid: 1, goalDescription: "Test goal" });
    const res = mockResponse();

    await removeGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "goal removed successfully",
      data: { removed: true },
    });
  });

  it("should handle Supabase error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "RPC error" } });

    const req = mockRequest({}, { hikeid: 1, goalDescription: "Test goal" });
    const res = mockResponse();

    await removeGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "RPC error" });
  });

  it("should handle unexpected errors", async () => {
    mockRpc.mockImplementationOnce(() => {
      throw new Error("Unexpected");
    });

    const req = mockRequest({}, { hikeid: 1, goalDescription: "Test goal" });
    const res = mockResponse();

    await removeGoal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
