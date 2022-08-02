import { Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useContextApi } from "../../../../lib/hooks/useContexApi";
import ColorPicker from "../ColorPicker";
import ExportLayout from "./ExportLayout";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const DesignBoard = ({ printComponentRef }) => {
  const {
    rectangles,
    setRectangles,
    circles,
    setCircles,
    images,
    setImages,
    zoomSquare,
    setZoomSquare,
  } = useContextApi();
  const { shapesSelected } = useSelector((state) => state.drawer);
  const [shapeProperties, setShapProperties] = useState(null);

  const handleChangeProperties = () => {
    switch (shapeProperties?.name) {
      case "rectangle":
        const rectangleId = rectangles.map((rect) => rect.id);
        const newReactAngle = rectangles.find(
          (rect) => rect.id === shapeProperties.id
        );
        if (!newReactAngle) return;
        const indexOfRectangle = rectangleId.indexOf(newReactAngle.id);
        rectangles[indexOfRectangle] = shapeProperties;
        setRectangles(rectangles);
        break;

      case "circle":
        const circleId = circles.map((rect) => rect.id);
        const newCircle = circles.find(
          (rect) => rect.id === shapeProperties.id
        );
        if (!newCircle) return;
        const indexOfcircle = circleId.indexOf(newCircle.id);
        circles[indexOfcircle] = shapeProperties;
        setCircles(circles);
        break;

      default:
        break;
    }
  };

  const handleChange = (event) => {
    setZoomSquare(event.target.value);
  };

  useEffect(() => {
    setShapProperties(shapesSelected);
  }, [shapesSelected]);

  useEffect(() => {
    if (!printComponentRef) return;
    switch (zoomSquare) {
      case 0.1:
        printComponentRef.current.style.transform = "scale(0.1)";
        break;
      case 0.5:
        printComponentRef.current.style.transform = "scale(0.5)";
        break;
      case 0.75:
        printComponentRef.current.style.transform = "scale(0.75)";
        break;
      case 1:
        printComponentRef.current.style.transform = "scale(1)";
        break;
    }
  }, [zoomSquare]);

  return (
    <>
      <FormControl sx={{ mt: "20px", ml: "5px", mr: "5px", width: "150px" }}>
        <InputLabel id="demo-simple-select-label">zoom</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-label"
          value={zoomSquare}
          label="100%"
          onChange={handleChange}
        >
          <MenuItem value={0.1}>10%</MenuItem>
          <MenuItem value={0.5}>50%</MenuItem>
          <MenuItem value={0.75}>75%</MenuItem>
          <MenuItem value={1}>100%</MenuItem>
        </Select>
      </FormControl>
      {shapesSelected && (
        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          <Stack direction="row" justifyContent="space-between">
            <p>X : {Math.round(shapeProperties?.x)}</p>
            <p>Y : {Math.round(shapeProperties?.y)}</p>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <p>W : {Math.round(shapeProperties?.width)}</p>
            <p>H : {Math.round(shapeProperties?.height)}</p>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <ColorPicker
                onSave={handleChangeProperties}
                useIcon={false}
                defaultColor={shapeProperties?.fill}
                getColor={(newColor) =>
                  setShapProperties({ ...shapeProperties, fill: newColor })
                }
              />

              <p>{shapeProperties?.fill}</p>
            </Stack>
            <Typography>Fill</Typography>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <ColorPicker
                onSave={handleChangeProperties}
                useIcon={false}
                defaultColor={shapeProperties?.color}
                getColor={(newColor) =>
                  setShapProperties({ ...shapeProperties, color: newColor })
                }
              />

              <p>{shapeProperties?.color}</p>
            </Stack>
            <Typography>Stroke</Typography>
          </Stack>
        </div>
      )}
      <ExportLayout componentRef={printComponentRef} />
    </>
  );
};

export default DesignBoard;
