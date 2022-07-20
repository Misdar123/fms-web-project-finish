import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Line } from "react-konva";
// import DrawToolbar from "./DrawToolbar";
// import { MODE, COLOR_MAP } from "./constants";

const getScaledPoint = (stage, scale) => {
  const { x, y } = stage.getPointerPosition();
  return { x: x / scale, y: y / scale };
};

const DrawPane = (props) => {
  let stage = null;
  const [color, setColor] = useState("DARK");
  const [scale, setScale] = useState(1);
  // const [mode, setMode] = useState(MODE.PENCIL);
  const [currentLine, setCurrentLine] = useState(null);
  const [lines, setLines] = useState([]);

  const onMouseDown = () => {
    const { x, y } = getScaledPoint(stage, scale);
    setCurrentLine({ points: [x, y], color });
  };

  const onMouseMove = () => {
    if (currentLine) {
      const { x, y } = getScaledPoint(stage, scale);
      const [x0, y0] = currentLine.points;
      setCurrentLine({
        ...currentLine,
        points: [x0, y0, x, y],
      });
      // switch (mode) {
      //   case MODE.PENCIL:
      //     setCurrentLine({
      //       ...currentLine,
      //       points: [...currentLine.points, x, y]
      //     });
      //     break;
      //   case MODE.LINE:
      //     const [x0, y0] = currentLine.points;
      //     setCurrentLine({
      //       ...currentLine,
      //       points: [x0, y0, x, y]
      //     });
      //     break;
      //   default:
      // }
    }
  };

  const onMouseUp = () => {
    const { x, y } = getScaledPoint(stage, scale);
    setCurrentLine(null);
    setLines([
      ...lines,
      { ...currentLine, points: [...currentLine.points, x, y] },
    ]);
  };

  const setStageRef = (ref) => {
    if (ref) {
      stage = ref;
    }
  };

  return (
    <Line {...currentLine} scale={{ x: scale, y: scale }} strokeWidth={1} />
  );
};

DrawPane.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default DrawPane;
