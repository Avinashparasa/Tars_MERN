import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";



function Notes() {
  

  return (
    <>
      <AddNote />

     
    </>
  );
}

export default Notes;