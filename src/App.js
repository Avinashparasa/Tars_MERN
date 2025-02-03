import "./App.css";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import AlertState from "./context/alert/alertState";
import Alert from "./components/Alert";
import Login from "./components/Auth/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/notes/noteState";
import Signup from "./components/Auth/Signup";
import Settings from "./pages/Settings"; // Import the Settings component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import AllNotes from "./components/AllNotes";
import Favourites from "./components/Favourites";

function App() {
  return (
    <>
      <AlertState>
        <NoteState>
          <Router>
            <Navbar />
            <Alert />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/allnotes" element={<AllNotes/>}/>
                <Route path="/favourites" element={<Favourites/>}/>
              </Routes>
            </div>
          </Router>
        </NoteState>
      </AlertState>
    </>
  );
}

export default App;
