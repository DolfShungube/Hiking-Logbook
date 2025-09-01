// backend/tests/routeController.test.js
const { getRoute } = require("../routes/routes.controller.js");

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

const mockRequest = (query = {}) => ({
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Route Controller - getRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Success case: Supabase returns data
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

  // Supabase returns an error (statusError exists)
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

  // Unexpected error (throws exception)
  it("should handle unexpected errors (catch block)", async () => {
    mockFrom.mockImplementation(() => {
      throw new Error("Unexpected exception");
    });

    const req = mockRequest({ routeid: 10 });
    const res = mockResponse();

    await getRoute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
