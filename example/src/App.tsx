import React from "react";
import { TagSphere } from "react-tag-sphere";
import "./App.css";

const tags = [
  <img
      width={50}
      src={"https://cdn.svgporn.com/logos/react.svg"}
      alt={"Random image"}
    />,
    <img
      width={50}
      src={"https://cdn.svgporn.com/logos/javascript.svg"}
      alt={"Random image"}
    />,
    "This",
    "Is",
    "How",
    "You",
    "Use",
    "Images",
    "As Tags"
 ]

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
        tags={tags}
        keepRollingAfterMouseOut={true}
        blur={false}
      />
    </div>
  );
}

export default App;
