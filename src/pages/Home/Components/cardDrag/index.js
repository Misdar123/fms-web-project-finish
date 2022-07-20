import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Card, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
      onDoubleClick={() => {
        onDoubleClick();
        handleActive();
      }}
    >
      {isActive && (
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          onClick={onClick}
        >
          <RemoveCircleIcon fontSize="20px" sx={{ color: "red" }} />
        </IconButton>
      )}
      <Card
        sx={{
          width: size ? ` ${size}px` : "50px",
          height: size ? ` ${size}px` : "50px",
          m: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: isActive ? "dodgerblue" : "white",
          backgroundColor: "dodgerblue"
        }}
      >
        {/* <img
          src={data?.icon.uri}
          width={size ? `${size / 2}px` : "30px"}
          height={size ? `${size / 2}px` : "30px"}
        /> */}
      </Card>
      <small>{data?.name}</small>
    </div>
  );
};

export default CardDrag;
