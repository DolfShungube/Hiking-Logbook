
const { getNotes, addNotes, removeNotes } = require("../notes/notes.controller.js");


jest.mock("@supabase/supabase-js", () => {

    
  
    const mockFinalEq = jest.fn(); 
    
  
    const mockEq = jest.fn().mockReturnThis(); 
    
   
    mockEq.mockImplementationOnce(function() { return this; }); 
    mockEq.mockImplementationOnce(function() { return { eq: mockFinalEq }; }); 

    
    const mockEqChain = { eq: mockFinalEq };
    const mockEqWrapper = jest.fn().mockReturnValue(mockEqChain); 

    const mockSelect = jest.fn().mockReturnValue({ eq: mockEqWrapper }); 

    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect }); 
    const mockRpc = jest.fn(); 

    return {
        createClient: jest.fn(() => ({
            from: mockFrom,
            rpc: mockRpc,
           
            __mockFinalEq: mockFinalEq, 
            __mockRpc: mockRpc,
            __mockFrom: mockFrom, 
            __mockEqWrapper: mockEqWrapper
        })),
    };
});


const { __mockFinalEq: mockFinalEq, __mockRpc: mockRpc, __mockFrom: mockFrom, __mockEqWrapper: mockEqWrapper } = require("@supabase/supabase-js").createClient();


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
       
        const mockSelect = jest.fn().mockReturnValue({ eq: mockEqWrapper });
        mockFrom.mockReturnValue({ select: mockSelect });
    });

    
    describe("getNotes", () => {
        it("should return notes successfully", async () => {
            const mockData = [{ noteId: 1, hikeid: 5, content: "Great hike!" }];

          
            mockFinalEq.mockResolvedValue({ data: mockData, error: null });

            const req = mockRequest({ hikeid: 5, userid: 1 });
            const res = mockResponse();

            await getNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: mockData });
        });

        it("should return 500 if Supabase returns an error", async () => {
            const statusError = { message: "Failed to fetch from DB" };

           
            mockFinalEq.mockResolvedValue({ data: null, error: statusError });

            const req = mockRequest({ hikeid: 5, userid: 1 });
            const res = mockResponse();

            await getNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
           
            expect(res.json).toHaveBeenCalledWith({ error: statusError.message });
        });

        it("should handle unexpected errors (catch block)", async () => {
            
            mockFrom.mockImplementation(() => { throw new Error("Unexpected exception"); });

            const req = mockRequest({ hikeid: 5, userid: 1 });
            const res = mockResponse();

            await getNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
          
            expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
        });
    });

   
    describe("addNotes", () => {
        it("should add note successfully", async () => {
            const mockData = { noteId: 1, hikeid: 5, content: "Great hike!" };

            mockRpc.mockResolvedValue({ data: mockData, error: null });

            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", userid: 1 });
            const res = mockResponse();

            await addNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "added new notes successfully",
                data: mockData,
            });
            
            expect(mockRpc).toHaveBeenCalledWith("add_hike_note", { 
                p_hikeid: 5, p_text: "Great hike!", p_user: 1 
            });
        });

        it("should return 500 if Supabase RPC returns error", async () => {
            const rpcError = { message: "RPC failed" };
            mockRpc.mockResolvedValue({ data: null, error: rpcError });

            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", userid: 1 });
            const res = mockResponse();

            await addNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
       
            expect(res.json).toHaveBeenCalledWith({ error: "RPC failed" });
        });

        it("should handle unexpected errors", async () => {
            mockRpc.mockImplementation(() => { throw new Error("Unexpected RPC error"); });

            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", userid: 1 });
            const res = mockResponse();

            await addNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
       
            expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
        });
    });

    // ------------------------------------
    // --- removeNotes tests ---
    // ------------------------------------
    describe("removeNotes", () => {
        it("should remove note successfully", async () => {
            const mockData = { noteId: 1, hikeid: 5, content: "Great hike!" };

            mockRpc.mockResolvedValue({ data: mockData, error: null });

            
            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15", userid: 1 });
            const res = mockResponse();

            await removeNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "note removed successfully",
                data: mockData,
            });
         
            expect(mockRpc).toHaveBeenCalledWith("remove_hike_note", { 
                p_hikeid: 5, p_text: "Great hike!", p_date: "2025-09-15", p_user: 1 
            });
        });

        it("should return 500 if Supabase RPC returns error", async () => {
            const rpcError = { message: "Remove RPC failed" };
            mockRpc.mockResolvedValue({ data: null, error: rpcError });

            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15", userid: 1 });
            const res = mockResponse();

            await removeNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            
            expect(res.json).toHaveBeenCalledWith({ error: "Remove RPC failed" });
        });

        it("should handle unexpected errors", async () => {
            mockRpc.mockImplementation(() => { throw new Error("Unexpected RPC error"); });

            const req = mockRequest({}, { hikeid: 5, text: "Great hike!", date: "2025-09-15", userid: 1 });
            const res = mockResponse();

            await removeNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
          
            expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
        });
    });
});