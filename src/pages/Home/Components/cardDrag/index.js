import React from "react";
import { useDrag } from "react-dnd";
import "./styles.css";
import DeviceComponent from "../deviceComponent";

const CardDrag = ({
  data,
  onDoubleClick = () => null,
  onMouseDown = () => null,
}) => {
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
      onMouseDown={onMouseDown}
      className="card-drag-container"
      onDoubleClick={onDoubleClick}
    >
      <DeviceComponent
        topLeftStyles={{
          backgroundColor: data.properties[0] ? "#ab30e4" : "black",
        }}
        topRightStyles={{
          backgroundColor: data.properties[1] ? "#ff9925" : "black",
        }}
        bottomLeftStyles={{
          backgroundColor: data.properties[3] ? "#FF2782" : "black",
        }}
        botomRightStyles={{
          backgroundColor: data.properties[2] ? "#34dd9f" : "black",
        }}
      />

      <small style={{ textAlign: "center" }}>{data?.deviceName}</small>
    </div>
  );
};

export default CardDrag;
