import React, { useState } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import { writeDataBase } from "../../lib/function/dataBaseCRUD";
import {
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
  serverTimestamp,
} from "firebase/database";
import { Button } from "@mui/material";

export default function TestPage() {
  const generateData = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push({ createdAt: serverTimestamp() });
    }
    return result;
  };

  const saveToDataBase = () => {
    writeDataBase("graph", generateData());
  };

  const getData = () => {
    const db = getDatabase();
    const q = query(ref(db, "graph"), orderByChild("createdAt"));
    onValue(q, (snap) => {
      console.log(snap.val());
    });
  };
  return (
    <div>
      <Button onClick={getData}>getData</Button>
      <Button onClick={saveToDataBase}>saveToDataBase</Button>
    </div>
  );
}

function SketchExample() {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState({
    r: "241",
    g: "112",
    b: "19",
    a: "1",
  });

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    console.log(color.rgb);
    setColor(color.rgb);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}
