import React, { useContext, useState, useRef } from "react";
import NoteContext from "../context/notes/noteContext";

function AddNote() {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const { notes, getNotes, editNote, toggleFavourite } = context;
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
    audio: null,
    image: null,
  });

  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);

  // Handle text input changes
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNote((prevNote) => ({
        ...prevNote,
        image: file,
      }));
    }
  };

  // Handle Speech-to-Text
  const handleVoiceInput = (noteId) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    // localStorage.setItem(`trans-${noteId}`, JSON.stringify({ trans: true }));
    recognition.onstart = () => {
      setIsListening(true);
      // Store transcription status in localStorage
      // localStorage.setItem(`trans-${noteId}`, JSON.stringify({ trans: true }));
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote((prevNote) => ({
        ...prevNote,
        description: prevNote.description + " " + transcript, // Append new text
        
      }));
      // localStorage.setItem(`trans-${noteId}`, JSON.stringify({ trans: true }));
    };
  
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => setIsListening(false);
  
    recognition.start();
  };
  

  // Handle Audio Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setNote((prevNote) => ({
          ...prevNote,
          audio: audioBlob,
        }));
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Handle Note Submission
  const handleAddNote = (e) => {
    e.preventDefault();
    if (note.tag === "") {
      note.tag = "General";
    }
    addNote(note.title, note.description, note.tag, note.audio, note.image,false);
    setNote({ title: "", description: "", tag: "", audio: null, image: null ,favourite:false});
    setAudioURL(null);
  };

  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form>
        {/* Title */}
        <div className="form-group my-3">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Enter title"
            onChange={onChange}
            value={note.title}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description/Transcription</label>
          <div className="d-flex align-items-center">
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Enter description"
              onChange={onChange}
              value={note.description}
              rows={5}
              style={{ resize: "none" }}
            />
            <button
              type="button"
              className={`btn btn-${isListening ? "danger" : "secondary"} mx-2`}
              onClick={()=>handleVoiceInput(note.id)}
            >
              🎤 {isListening ? "Listening..." : "Speak"}
            </button>
          </div>
        </div>

        {/* Audio Recording */}
        <div className="form-group my-3">
          <label>Record Voice Note</label>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`btn btn-${isRecording ? "danger" : "primary"}`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          {audioURL && (
            <div className="mt-2">
              <audio controls src={audioURL}></audio>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="form-group my-3">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {note.image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(note.image)}
                alt="Uploaded Preview"
                className="img-thumbnail"
                width="200"
              />
            </div>
          )}
        </div>

        {/* Tag */}
        <div className="form-group my-3">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            placeholder="Enter your custom tag (default: General)"
            onChange={onChange}
            value={note.tag}
          />
        </div>
        {/* <button
              className="btn btn-warning mx-2"
              onClick={() => toggleFavourite(note._id)}
            >
              {note.favourite ? "Unfavourite" : "Favourite"}
            </button> */}

        {/* Submit Button */}
        <button
          disabled={note.title.length < 3 || note.description.length < 4}
          type="submit"
          className="btn btn-primary"
          onClick={handleAddNote}
        >
          Add Note
        </button>
      </form>
    </div>
  );
}

export default AddNote;
