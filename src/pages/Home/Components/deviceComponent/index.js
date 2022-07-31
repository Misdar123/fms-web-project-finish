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
        <div className="cornor top-left" style={topLeftStyles}></div>
        <div className="cornor top-right" style={topRightStyles}></div>
        <div className="cornor bottom-left" style={bottomLeftStyles}></div>
        <div className="cornor bottom-right" style={botomRightStyles}></div>
      </div>
    </div>
  );
};
export default DeviceComponent;
