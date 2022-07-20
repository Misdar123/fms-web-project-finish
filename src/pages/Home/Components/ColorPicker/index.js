import React, { useState } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";

export default function ColorPicker({ onSave, getColor = () => null, useIcon = false, defaultColor = "#000"}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(defaultColor);

  const handleClick = () => {
    onSave()
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
    onSave()
  };

  const handleChange = (color) => {
    setColor(color.rgb);
    getColor(color.hex);
  };

  const styles = reactCSS({
    default: {
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
      <div onClick={handleClick}>
        {!useIcon ? (
          <div
            style={{
              backgroundColor: defaultColor,
              height: "20px",
              width: "20px",
              border: "1px solid #f3f3f3"
            }}
          ></div>
        ) : (
          <FormatColorFillIcon
            style={{
              color: color,
            }}
          />
        )}
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange}/>
        </div>
      ) : null}
    </div>
  );
}
