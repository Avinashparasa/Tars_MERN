import React from "react";
import Notes from "../components/Notes";

function Home() {
  document.title = "MyNottebok - Home";
  return (
    <div>
      <Notes />
    </div>
  );
}

export default Home;
