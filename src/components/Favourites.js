import React, { useContext, useEffect } from "react";
import NoteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { favourites, getFavourites } = context;

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      getFavourites();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 font-weight-bold">Your Favourite Notes</h2>

      {favourites.length === 0 ? (
        <h3 className="text-center text-muted">No favourite notes to display!</h3>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {favourites.map((note) => (
            <div key={note._id} className="col">
              <div className="card shadow-sm h-100">
                {/* Image Section */}
                {note.image ? (
                  <img
                    src={`http://localhost:5000/${note.image}`}
                    alt="Note"
                    className="card-img-top"
                    style={{ height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      height: "120px",
                      backgroundColor: "#f8f9fa",
                      fontSize: "14px",
                      color: "#6c757d",
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{note.title}</h5>
                  <p className="card-text text-truncate" style={{ maxHeight: "60px" }}>
                    {note.description}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">{note.tag}</small>
                  </p>

                  {/* Audio Section */}
                  {note.audio && (
                    <audio controls className="w-100 mt-auto">
                      <source
                        src={`http://localhost:5000/${note.audio}`}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
