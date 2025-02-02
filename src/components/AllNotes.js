import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:5000/";
const AllNotes = () => {
    let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;
  const [favourites, setFavourites] = useState([]);


  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      getNotes();
      loadFavourites();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const modalRef = useRef(null); // Ref for the modal element

  const [note, setNote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    etag: "",
    eimage: null,
    eaudio: null,
    previewImage: null,
    previewAudio: null,
  });

  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Handle audio play event
  const handleAudioPlay = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Handle audio pause/end event
  const handleAudioPause = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Handle fullscreen toggle
  const [isFullscreen, setIsFullscreen] = useState(false);

const toggleFullscreen = () => {
  if (modalRef.current) {
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }
};

const loadFavourites = () => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteNotes")) || [];
    setFavourites(storedFavourites);
  };
  const toggleFavourite = (note) => {
    let updatedFavourites = [...favourites];
    const index = updatedFavourites.findIndex((fav) => fav._id === note._id);

    if (index !== -1) {
      updatedFavourites.splice(index, 1); // Remove if already a favourite
    } else {
      updatedFavourites.push(note); // Add if not a favourite
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favouriteNotes", JSON.stringify(updatedFavourites));
  };

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      eid: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
      eimage: currentNote.image ? `${BASE_URL}${currentNote.image}` : null,
      eaudio: currentNote.audio ? `${BASE_URL}${currentNote.audio}` : null,
      previewImage: currentNote.image ? `${BASE_URL}${currentNote.image}` : null,
      previewAudio: currentNote.audio ? `${BASE_URL}${currentNote.audio}` : null,
    });
    setTranscript(currentNote.transcript || "");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (name === "eimage") {
      setNote({ ...note, eimage: file, previewImage: previewURL });
    } else if (name === "eaudio") {
      setNote({ ...note, eaudio: file, previewAudio: previewURL });
    }
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (note.etag === "") {
      note.etag = "General";
    }
    editNote(
      note.eid,
      note.etitle,
      note.edescription,
      note.etag,
      note.eaudio,
      note.eimage,
      transcript
    );
    refClose.current.click();
  };
  return (
    <div className="row my-3">
    <button
      ref={ref}
      type="button"
      className="btn btn-primary d-none"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Launch demo modal
    </button>

    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={modalRef} // Ref for the modal
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Note</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group my-3">
                <label htmlFor="etitle">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="etitle"
                  name="etitle"
                  placeholder="Enter title"
                  onChange={onChange}
                  value={note.etitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edescription">Description</label>
                <textarea
                  className="form-control"
                  id="edescription"
                  name="edescription"
                  placeholder="Enter description"
                  onChange={onChange}
                  value={note.edescription}
                  rows={5}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="form-group my-3">
                <label htmlFor="etag">Tag</label>
                <input
                  type="text"
                  className="form-control"
                  id="etag"
                  name="etag"
                  placeholder="Enter your custom tag"
                  onChange={onChange}
                  value={note.etag}
                />
              </div>

              {/* Display & Replace Image */}
              <div className="form-group my-3">
  <label>Current Image</label>
  {note.previewImage ? (
    <div className="relative w-full h-40 overflow-hidden rounded-md border border-gray-300">
      <img
        src={note.previewImage}
        alt="Current Note"
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <p>No image uploaded</p>
  )}
  <input
    type="file"
    name="eimage"
    className="form-control mt-2"
    onChange={handleFileChange}
  />
</div>

              {/* Display & Replace Audio */}
              <div className="form-group my-3">
                <label>Current Audio</label>
                {note.previewAudio ? (
                  <>
                    <audio
                      ref={audioRef}
                      controls
                      style={{ width: "100%" }}
                      key={note.eid}
                      onPlay={handleAudioPlay}
                      onPause={handleAudioPause}
                      onEnded={handleAudioPause}
                    >
                      <source
                        src={note.previewAudio.replace(/\\/g, "/")}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="mt-2">
                      <strong>Transcript:</strong>
                      <p>{transcript}</p>
                    </div>
                  </>
                ) : (
                  <p>No audio uploaded</p>
                )}
                <input
                  type="file"
                  name="eaudio"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary me-2" onClick={toggleFullscreen}>
  {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
</button>

            <button
              ref={refClose}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              disabled={
                note.etitle.length < 3 || note.edescription.length < 4
              }
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateNote}
            >
              Update Note
            </button>
          </div>
        </div>
      </div>
    </div>

    <h2>Your Notes</h2>
    <div className="container mx-3 my-3">
      <h3 className="text-center">
        {notes.length === 0 && "No notes to display!!"}
      </h3>
    </div>
    {notes.map((note) => (
        <>
      <NoteItem key={note._id} note={note} updateNote={updateNote} />
      <button
            className={`btn ${favourites.some((fav) => fav._id === note._id) ? "btn-danger" : "btn-outline-danger"} mt-2`}
            onClick={() => toggleFavourite(note)}
          >
            {favourites.some((fav) => fav._id === note._id) ? "Unfavourite" : "Add to Favourites"}
          </button>
          </>
    ))}
  </div>
  )
}

export default AllNotes