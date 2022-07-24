import React from "react";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Icon from "../../assets/images/icon.png";

const IconLogo = () => {
  const isScreenMedium = useMediaQuery((theme) => theme.breakpoints.up("md"));
  return (
    <>
      <IconButton size="large" edge="start" color="inherit" sx={{ mb: 1 }}>
        <LocalFireDepartmentIcon sx={{ height: "40px", width: "40px" }} />
        {/* <img src={Icon} style={{ height: "30px", width: "30px" }} /> */}
      </IconButton>
      <Typography
        variant="h6"
        fontWeight="bold"
        fontFamily="monospace"
        sx={{ flexGrow: 1 }}
      >
        {isScreenMedium ? "Field Instruments and Management System" : "FMS"}
      </Typography>
    </>
  );
};

export default IconLogo;
