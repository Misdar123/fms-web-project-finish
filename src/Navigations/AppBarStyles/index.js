import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import IconLogo from "./IconLogo";
import { Badge, Box, Button, Paper, Stack, Typography } from "@mui/material";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { signOut, getAuth } from "firebase/auth";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppBarStyles = ({ isOpen, setIsOpen }) => {
  const { setIsAuth, setChangeThem } = useContextApi();
  const [openPopUp, setOpenPopUp] = useState(false);

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };

  const handleLogout = () => {
    const auth = getAuth();
    localStorage.clear();
    setChangeThem(false);
    signOut(auth).then(() => {
      setIsAuth(false);
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  return (
    <AppBar position="fixed" open={isOpen}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 2,
            ...(isOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <IconLogo />
        {/* sx={{ display: { xs: "none", md: "flex" } }} */}
        <Box>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
            onClick={handleOpenMenu}
          >
            <Badge badgeContent={0} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleOpenMenu}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handlePopUp}>
            <Typography color={"#FFF"} fontWeight="bold">
              Logout
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
      <Paper sx={{ width: 320, maxWidth: "100%" }}>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <div
              style={{
                minHeight: "100px",
                width: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <CommentsDisabledIcon sx={{ color: "gray" }} />
                <Typography sx={{ color: "gray" }}>Nothing</Typography>
              </Stack>
            </div>
          </MenuItem>
        </Menu>
      </Paper>
      <Dialog
        open={openPopUp}
        onClose={handlePopUp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            are you sure want to exit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopUp}>cancel</Button>
          <Button onClick={handleLogout} autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default AppBarStyles;
