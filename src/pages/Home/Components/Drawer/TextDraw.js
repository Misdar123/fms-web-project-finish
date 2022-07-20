import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";

const TextDraw = ({ textProps, isSelected, onSelect, onChange }) => {
  const textRef = useRef();
  const trRef = useRef();
  const [showTextArea, setShowTextArea] = useState(false);
  const [text, setText] = useState(textProps.text);

  useEffect(() => {
    if (isSelected) {
      // attach transformer manually
      trRef.current.setNode(textRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleOnDoubleClick = () => {
    setShowTextArea(!showTextArea);
  };

  return (
    <>
      {isSelected && <Transformer ref={trRef} />}
      {showTextArea ? (
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      ) : (
        <Text
          onDblClick={handleOnDoubleClick}
          draggable
          onClick={onSelect}
          ref={textRef}
          {...textProps}
          onDragEnd={(e) => {
            onChange({
              ...textProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale
            const node = textRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...textProps,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
      )}
    </>
  );
};

export default TextDraw;
