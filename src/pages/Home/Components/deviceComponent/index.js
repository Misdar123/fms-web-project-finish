import React from "react";
import "./styles.css";

const DeviceComponent = ({
  topLeftStyles,
  topRightStyles,
  bottomLeftStyles,
  botomRightStyles,
  deviceStyle,
}) => {
  return (
    <div className="shadow" style={deviceStyle}>
      <div className="container">
        <div className="cornor top-left"></div>
        <div className="cornor top-right"></div>
        <div className="cornor bottom-left"></div>
        <div className="cornor bottom-right"></div>
      </div>
    </div>
  );
};
export default DeviceComponent;
