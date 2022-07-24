import React from "react";
import Lottie from "lottie-react";
import emptyDataAnimation from "../../assets/animations/data-empty.json";
import { Typography, colors } from "@mui/material";

const EmptyLayoutAnimation = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        style={{ height: "300px", width: "300px" }}
        animationData={emptyDataAnimation}
        loop={false}
      />
      <Typography sx={{ fontWeight: "bold", color: colors.grey[500] }}>
        Layout Empty
      </Typography>
    </div>
  );
};

export default EmptyLayoutAnimation;
