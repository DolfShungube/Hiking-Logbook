import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const NotesDataContext = createContext(null);

export const NotesDataContextProvider = ({ children }) => {
  // Fetch notes for a hike
  const getNotes = async (hike_id) => {
    try {
      const { data, error } = await supabase
        .from("hikeNotes")
        .select("*")
        .eq("hikeid", hike_id)
        .order("date", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching notes:", err);
      throw err;
    }
  };

  // Add a new note
  const addNote = async (hike_id, noteText) => {
    try {
      const { data, error } = await supabase
        .from("hikeNotes")
        .insert([{ hikeid: hike_id, text: noteText, date: new Date().toISOString() }]);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error adding note:", err);
      throw err;
    }
  };

  // Update an existing note
  const updateNote = async (hike_id, noteDate, noteText) => {
    try {
      const { data, error } = await supabase
        .from("hikeNotes")
        .update({ text: noteText, date: new Date().toISOString() })
        .eq("hikeid", hike_id)
        .eq("date", noteDate);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating note:", err);
      throw err;
    }
  };

  // Delete a note
  const deleteNote = async (hike_id, noteDate) => {
    try {
      const { data, error } = await supabase
        .from("hikeNotes")
        .delete()
        .eq("hikeid", hike_id)
        .eq("date", noteDate);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting note:", err);
      throw err;
    }
  };

  return (
    <NotesDataContext.Provider value={{ getNotes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesDataContext.Provider>
  );
};

export const NotesDataCollection = () => useContext(NotesDataContext);
