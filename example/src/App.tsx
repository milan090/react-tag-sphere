import React from "react";
import { TagSphere } from "react-tag-sphere";
import "./App.css";

function App() {
  return (
    <div style={{ background: "#0b0b0b", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <TagSphere
        style={{
          color: "green",
          fontWeight: "bold",
          fontSize: "1.2rem",
          fontFamily: "monospace",
        }}
        keepRollingAfterMouseOut={true}
        blur={false}
      />
    </div>
  );
}

export default App;
