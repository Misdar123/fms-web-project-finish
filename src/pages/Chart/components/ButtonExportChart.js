import React, { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ButtonPrintChart = ({ componentRef, children}) => {
  const [fileName, setFileName] = useState("chart");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = (fileType) => {
    switch (fileType) {
      case "png":
        exportComponentAsPNG(componentRef, { fileName: fileName });
        break;
      case "jpg":
        exportComponentAsJPEG(componentRef, { fileName: fileName });
        break;
      case "pdf":
        exportComponentAsPDF(componentRef, { fileName: fileName });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Button onClick={handleOpenMenu} variant="outlined">
        {children}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handlePrint("png")}>Print as png</MenuItem>
        <MenuItem onClick={() => handlePrint("jpg")}>Print as jpg</MenuItem>
        <MenuItem onClick={() => handlePrint("pdf")}>Print as pdf</MenuItem>
      </Menu>
    </>
  );
};

export default ButtonPrintChart;
