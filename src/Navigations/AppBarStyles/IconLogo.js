import React from "react";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";

const IconLogo = () => {
  return (
    <>
      <IconButton size="large" edge="start" color="inherit" sx={{ mb: 1 }}>
        <LocalFireDepartmentIcon sx={{ height: "40px", width: "40px" }} />
      </IconButton>
      <Typography
        variant="h6"
        fontWeight="bold"
        fontFamily="monospace"
        sx={{ flexGrow: 1 }}
      >
        Field Instruments and Management System
      </Typography>
    </>
  );
};

export default IconLogo;
