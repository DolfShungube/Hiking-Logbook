// backend/tests/notesController.test.js
const { getNotes } = require("../notes/notes.controller.js");

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

describe("Notes Controller - getNotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    mockFrom.mockImplementation(() => {
      throw new Error("Unexpected exception");
    });

    const req = mockRequest({ hikeid: 5 });
    const res = mockResponse();

    await getNotes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });
});
