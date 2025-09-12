import { createContext, useContext } from "react";

const NotesDataContext = createContext(null);

export const NotesDataContextProvider = ({ children }) => {
  const getNotes = async (hike_id) => {
    try {
      const res = await fetch(
        `https://hiking-logbook-api.onrender.com/get-notes?hikeid=${encodeURIComponent(hike_id)}`,
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching goals:", data.error);
        throw new Error(data.error || "Failed to fetch goals");
      }

      return data?.data[0]?.notes?.notes || [];
    } catch (err) {
      console.error("fetching error:", err);
      throw err;
    }
  };

  const addNote = async (hike_id, text) => {
    try {
      const res = await fetch(
        "https://hiking-logbook-api.onrender.com/add-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hikeid: hike_id,
            text: text,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return data;
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error("error:", err);
      throw err;
    }
  };

  const removeNote = async (hike_id, text, date) => {
    try {
      const res = await fetch(
        "https://hiking-logbook-api.onrender.com/remove-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hikeid: hike_id,
            text: text,
            date: date,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return data;
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error("error:", err);
      throw err;
    }
  };

  return (
    <NotesDataContext.Provider value={{ getNotes, addNote, removeNote }}>
      {children}
    </NotesDataContext.Provider>
  );
};

export const NotesDataCollection = () => {
  return useContext(NotesDataContext);
};
