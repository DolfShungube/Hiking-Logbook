import { createContext, useContext } from "react";

const NotesDataContext = createContext(null);

export const NotesDataContextProvider = ({ children }) => {
  const getNotes = async (hike_id,userid) => {
    try {
      const res = await fetch(
        `https://hiking-logbook-api.onrender.com/get-notes?hikeid=${encodeURIComponent(hike_id)}&userid=${encodeURIComponent(userid)}`,
        { method: "GET" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch notes");
      return data?.data[0]?.notes?.notes || [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addNote = async (hike_id, text,userid) => {
    try {
      const res = await fetch("https://hiking-logbook-api.onrender.com/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hikeid: hike_id, text:text,userid:userid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeNote = async (hike_id, text, date,userid) => {
    try {
      const res = await fetch("https://hiking-logbook-api.onrender.com/remove-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hikeid: hike_id, text:text, date:date,userid:userid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <NotesDataContext.Provider value={{ getNotes, addNote, removeNote }}>
      {children}
    </NotesDataContext.Provider>
  );
};

export const NotesDataCollection = () => useContext(NotesDataContext);
