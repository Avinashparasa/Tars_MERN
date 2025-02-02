import { useState, useContext } from "react";
import NoteContext from "./noteContext";
import AlertContext from "../alert/alertContext";

const NoteState = (props) => {
  const host = process.env.REACT_APP_NOTES_HOST;
  const authToken = localStorage.getItem("auth-token");
  const [notes, setNotes] = useState([]);

  const alertContext = useContext(AlertContext);
  const { showAlert } = alertContext;

  // Function to fetch all notes
  const getNotes = async () => {
    try {
      let url = `${host}/fetchnotes`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "auth-token": authToken,
        },
      });
      const allNotes = await response.json();

      if (response.ok) {
        showAlert("Fetched all notes", "info");
        setNotes(allNotes);
      } else {
        console.log("Error:", allNotes.error);
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  // Function to add a note with image and audio
  const addNote = async (title, description, tag, audio, image) => {
    try {
      let url = `${host}/addnote`;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      if (audio) formData.append("audio", audio);
      if (image) formData.append("image", image);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": authToken,
        },
        body: formData, // Send data as FormData
      });

      const note = await response.json();
      if (response.ok) {
        setNotes(notes.concat(note));
        showAlert("Note Added Successfully", "success");
      } else {
        showAlert(`Server Error: ${note.errors[0]?.msg || "Failed to add note"}`, "danger");
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  // Function to edit a note (updates title, description, tag, and optionally replaces image/audio)
  const editNote = async (id, title, description, tag, audio, image) => {
    try {
      let url = `${host}/updatenote/${id}`;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      if (audio) formData.append("audio", audio);
      if (image) formData.append("image", image);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "auth-token": authToken,
        },
        body: formData,
      });

      const updatedNote = await response.json();

      let newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
        if (newNotes[index]._id === updatedNote._id) {
          newNotes[index] = updatedNote;
          break;
        }
      }
      setNotes(newNotes);
      showAlert("Note Edited Successfully", "warning");
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  // Function to delete a note
  const deleteNote = async (id) => {
    try {
      let url = `${host}/deletenote/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id));
        showAlert("Note Deleted Successfully", "danger");
      } else {
        showAlert("Failed to delete note", "danger");
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  // Function to delete all notes
  const deleteAllNotes = async () => {
    try {
      let url = `${host}/deleteallnotes`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (response.ok) {
        setNotes([]);
        showAlert("All Notes Deleted Successfully", "danger");
      } else {
        showAlert("Failed to delete all notes", "danger");
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  const toggleNoteFavourite = async (id) => {
  try {
    let url = `${host}/togglenotefavourite/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "auth-token": authToken,
      },
    });

    const updatedNote = await response.json();
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      if (newNotes[index]._id === updatedNote._id) {
        newNotes[index] = updatedNote;
        break;
      }
    }
    setNotes(newNotes);
    showAlert("Note Favourite Status Updated", "info");
  } catch (error) {
    showAlert(`Error: ${error.message}`, "danger");
  }
};

const fetchFavourites = async () => {
  try {
    let url = `${host}/fetchfavourites`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": authToken,
      },
    });
    const favouriteNotes = await response.json();
    return favouriteNotes;
  } catch (error) {
    showAlert(`Error: ${error.message}`, "danger");
    return [];
  }
};

return (
  <NoteContext.Provider
    value={{ notes, addNote, deleteNote, editNote, getNotes, deleteAllNotes, toggleNoteFavourite, fetchFavourites }}
  >
    {props.children}
  </NoteContext.Provider>
);

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes, deleteAllNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
