// import React, { useContext, useEffect, useState } from "react";
// import NoteContext from "../context/notes/noteContext";
// import NoteItem from "./NoteItem";

// const Favourites = () => {
//   const context = useContext(NoteContext);
//   const { fetchFavourites } = context;
//   const [favouriteNotes, setFavouriteNotes] = useState([]);

//   useEffect(() => {
//     const getFavourites = async () => {
//       const favourites = await fetchFavourites();
//       setFavouriteNotes(favourites);
//     };
//     getFavourites();
//   }, []);

//   return (
//     <div className="row my-3">
//       <h2>Favourite Notes</h2>
//       <div className="container mx-3 my-3">
//         <h3 className="text-center">
//           {favouriteNotes.length === 0 && "No favourite notes to display!!"}
//         </h3>
//       </div>
//       {favouriteNotes.map((note) => (
//         <NoteItem key={note._id} note={note} />
//       ))}
//     </div>
//   );
// };

// export default Favourites;
import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

const Favourites = () => {
  const [favouriteNotes, setFavouriteNotes] = useState([]);

  useEffect(() => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteNotes")) || [];
    setFavouriteNotes(storedFavourites);
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Favourite Notes</h2>
      <div className="row">
        {favouriteNotes.length === 0 ? (
          <div className="col-12 text-center">
            <h3 className="text-muted">No favourite notes to display!</h3>
          </div>
        ) : (
          favouriteNotes.map((note) => (
            <div key={note._id} className="col-md-4 mb-4">
              <NoteItem note={note} nothing={true} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favourites;