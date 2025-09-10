import { createContext, useContext } from "react";

const NotesDataContext = createContext(null);

export const NotesDataContextProvider = ({ children }) => {

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
      console.error("fetching error:", err);
      throw err;
    }
  };

  const addNote = async (hike_id, noteText) => {
    try {
      const res = await fetch('https://hiking-logbook-api.onrender.com/add-note', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hikeid: hike_id,
          noteDescription: noteText,
          noteDate: new Date().toISOString() // automatically add current date
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error adding note:", data.error);
        throw new Error(data.error || "Failed to add note");
      }

      return data;
    } catch (err) {
      console.error("error:", err);
      throw err;
    }
  };

  return (
    <NotesDataContext.Provider value={{ getNotes, addNote }}>
      {children}
    </NotesDataContext.Provider>
  );
};

export const NotesDataCollection = () => useContext(NotesDataContext);
