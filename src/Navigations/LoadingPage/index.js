import React from "react";
import { LinearProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <>
      <LinearProgress />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        <h1 style={{ color: "dodgerblue" }}>loading...</h1>
      </div>
    </>
  );
};

export default LoadingPage;
