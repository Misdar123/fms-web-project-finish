import React, { useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const ImgPicker = ({ shapeProps, isSelected, onSelect, onChange, imageUrl }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const [image] = useImage(imageUrl);

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Image
        onClick={onSelect}
        image={image}
        ref={shapeRef}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};
export default ImgPicker;
