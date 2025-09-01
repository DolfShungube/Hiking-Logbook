// backend/tests/goals.test.js
const { getGoals } = require("../goals/goals.controller.js");

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

// Helper to mock request and response objects
const mockRequest = (query = {}) => ({ query });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Access the mock
const { __mockFrom: mockFrom } = require("@supabase/supabase-js").createClient();

describe("getGoals Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    mockFrom.mockImplementationOnce(() => { throw new Error("Unexpected"); });

    const req = mockRequest({ hikeid: 1 });
    const res = mockResponse();

    await getGoals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
