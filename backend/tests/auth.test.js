// backend/tests/authController.test.js
const { signIn, signInWithGoogle, signUp } = require("../auth/auth.controller.js");

jest.mock("@supabase/supabase-js", () => {
  const mockAuth = {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
  };
  return {
    createClient: jest.fn(() => ({
      auth: mockAuth,
      __mockAuth: mockAuth,
    })),
  };
});

const { __mockAuth: mockAuth } = require("@supabase/supabase-js").createClient();

const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------ signIn ------------------
  describe("signIn", () => {
    it("should log in successfully and set cookie", async () => {
      const user = { id: 1, email: "test@test.com" };
      const session = { access_token: "abc123" };
      mockAuth.signInWithPassword.mockResolvedValue({ data: { user, session }, error: null });

      const req = mockRequest({ email: "test@test.com", password: "pass123" });
      const res = mockResponse();

      await signIn(req, res);

      expect(res.cookie).toHaveBeenCalledWith("sb-access-token", "abc123", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login successful", user, session });
    });

    it("should return 401 if login fails", async () => {
      mockAuth.signInWithPassword.mockResolvedValue({ data: null, error: { message: "Invalid credentials" } });

      const req = mockRequest({ email: "wrong@test.com", password: "wrong" });
      const res = mockResponse();

      await signIn(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });
  });

  // ------------------ signInWithGoogle ------------------
  describe("signInWithGoogle", () => {
    it("should return OAuth URL successfully", async () => {
      const url = "https://supabase.io/oauth";
      mockAuth.signInWithOAuth.mockResolvedValue({ data: { url }, error: null });

      const req = mockRequest({ frontendBaseUrl: "http://localhost:3000" });
      const res = mockResponse();

      await signInWithGoogle(req, res);

      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: "http://localhost:3000/dashboard" },
      });
      expect(res.json).toHaveBeenCalledWith({ url });
    });

    it("should return 401 if OAuth login fails", async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({ data: null, error: { message: "OAuth failed" } });

      const req = mockRequest({ frontendBaseUrl: "http://localhost:3000" });
      const res = mockResponse();

      await signInWithGoogle(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "OAuth failed" });
    });
  });

  // ------------------ signUp ------------------
  describe("signUp", () => {
    it("should sign up successfully", async () => {
      const user = { id: 1, email: "new@test.com" };
      mockAuth.signUp.mockResolvedValue({ data: { user }, error: null });

      const req = mockRequest({ firstName: "John", lastName: "Doe", email: "new@test.com", password: "pass123" });
      const res = mockResponse();

      await signUp(req, res);

      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: "new@test.com",
        password: "pass123",
        options: { data: { firstname: "John", lastname: "Doe" } },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it("should return 400 if sign up fails", async () => {
      mockAuth.signUp.mockResolvedValue({ data: null, error: { message: "Email already exists" } });

      const req = mockRequest({ firstName: "John", lastName: "Doe", email: "existing@test.com", password: "pass123" });
      const res = mockResponse();

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
    });
  });
});
