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
    <div class="shadow" style={deviceStyle}>
      <div class="container">
        <div class="cornor top-left"></div>
        <div class="cornor top-right"></div>
        <div class="cornor bottom-left"></div>
        <div class="cornor bottom-right"></div>
      </div>
    </div>
  );
};
export default DeviceComponent;
