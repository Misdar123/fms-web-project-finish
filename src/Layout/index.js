import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import DrawerLeft from "../Navigations/DrawerLeft";
import AppBarStyles from "../Navigations/AppBarStyles";
import { useContextApi } from "../lib/hooks/useContexApi";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }} >
      <CssBaseline />
      <AppBarStyles isOpen={open} setIsOpen={setOpen} />
      <DrawerLeft isOpen={open} setIsOpen={setOpen} />
      <Box component="main" sx={{ flexGrow: 1}}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
