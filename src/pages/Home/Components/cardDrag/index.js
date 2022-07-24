import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Card, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import "./styles.css";
import DeviceComponent from "../deviceComponent";

const CardDrag = ({
  data,
  size,
  onDoubleClick = () => null,
  onClick = () => null,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleActive = () => {
    setIsActive(!isActive);
  };

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "card",
    item: { id: data?.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className="card-drag-container"
      onDoubleClick={() => {
        onDoubleClick();
        handleActive();
      }}
    >
      {isActive && (
        <IconButton
          sx={{ position: "absolute", top: "-20px", zIndex: 2}}
          onClick={onClick}
        >
          <RemoveCircleIcon fontSize="20px" sx={{ color: "red" }} />
        </IconButton>
      )}
      <DeviceComponent />

      <small style={{textAlign: "center"}}>{data?.name}</small>
    </div>
  );
};

export default CardDrag;
