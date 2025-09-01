// backend/tests/userController.test.js
const { fetchUser } = require("../users/users.controller.js");

jest.mock("@supabase/supabase-js", () => {
  const mockRpc = jest.fn();
  return {
    createClient: jest.fn(() => ({
      rpc: mockRpc,
      __mockRpc: mockRpc,
    })),
  };
});

const { __mockRpc: mockRpc } = require("@supabase/supabase-js").createClient();

const mockRequest = (query = {}) => ({
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller - fetchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Success case: RPC returns user data
  it("should fetch user successfully", async () => {
    const mockData = { id: 1, name: "John Doe" };

    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const req = mockRequest({ userid: 1 });
    const res = mockResponse();

    await fetchUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "user fetched successfully",
      data: mockData,
    });
  });

  // Supabase RPC returns an error (sentError exists)
  it("should return 500 if RPC returns an error", async () => {
    const sentError = { message: "RPC failed" };

    mockRpc.mockResolvedValue({ data: null, error: sentError });

    const req = mockRequest({ userid: 1 });
    const res = mockResponse();

    await fetchUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "RPC failed" });
  });

  // Unexpected error (throws exception)
  it("should handle unexpected errors (catch block)", async () => {
    mockRpc.mockImplementation(() => {
      throw new Error("Unexpected exception");
    });

    const req = mockRequest({ userid: 1 });
    const res = mockResponse();

    await fetchUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
