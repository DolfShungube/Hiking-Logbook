import { createContext, useContext } from "react";

const NotesDataContext = createContext(null);

export const NotesDataContextProvider = ({ children }) => {
  // Fetch all notes for a hike
  const getNotes = async (hike_id) => {
    try {
      const res = await fetch(
        `https://hiking-logbook-api.onrender.com/get-notes?hikeid=${encodeURIComponent(hike_id)}`,
        { method: "GET" }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching notes:", data.error);
        throw new Error(data.error || "Failed to fetch notes");
      }

      return data?.data[0]?.notes?.notes || [];
    } catch (err) {
      console.error("Fetching error:", err);
      throw err;
    }
  };

  // Add a new note
  const addNote = async (hike_id, text) => {
    try {
      const res = await fetch("https://hiking-logbook-api.onrender.com/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hikeid: hike_id, text: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error adding note:", data.error);
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };

  // Remove a note
  const removeNote = async (hike_id, text, date) => {
    try {
      const res = await fetch("https://hiking-logbook-api.onrender.com/remove-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hikeid: hike_id, text: text, date: date }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error removing note:", data.error);
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      return data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };

  return (
    <NotesDataContext.Provider value={{ getNotes, addNote, removeNote }}>
      {children}
    </NotesDataContext.Provider>
  );
};

// Hook for consuming the context
export const NotesDataCollection = () => useContext(NotesDataContext);
