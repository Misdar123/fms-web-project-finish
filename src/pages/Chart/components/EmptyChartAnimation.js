import React from "react"
import { Typography, colors } from "@mui/material"
import Lottie from "lottie-react";
import emptyDataAnimation from "../../../assets/animations/data-empty.json";

const  EmptyChartAnimation = () => {
    return <div
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
        loop={false} />
      <Typography sx={{ fontWeight: "bold", color: colors.grey[500] }}>
        Data empty
      </Typography>
    </div>
  }

  export default EmptyChartAnimation