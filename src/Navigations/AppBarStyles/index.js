import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import IconLogo from "./IconLogo";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {
  Badge,
  Box,
  Button,
  colors,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { signOut, getAuth } from "firebase/auth";
import Menu from "@mui/material/Menu";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";
import { writeDataBase } from "../../lib/function/dataBaseCRUD";

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
  const {
    setIsAuth,
    setChangeThem,
    changeThem,
    currentUserId,
    notificationMessage,
  } = useContextApi();
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

  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleDeleteNotification = (indexDelete) => {
    const newData = [];
    notificationMessage.forEach((data, index) => {
      if (index === indexDelete) return;
      newData.push(data);
    });

    const path = `users/${currentUserId}/notification`;
    writeDataBase(path, newData);
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
            // onClick={handleOpenMenu}
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
            <Badge badgeContent={notificationMessage.length} color="error">
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

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Box
          style={{
            height: window.innerHeight,
            display: "flex",
            padding: "10px",
            maxWidth: "400px",
          }}
        >
          {notificationMessage.length === 0 && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              flex={1}
              width="400px"
            >
              <CommentsDisabledIcon sx={{ color: "gray" }} />
              <Typography sx={{ color: "gray" }}>
                tidak ada notifikasi
              </Typography>
            </Stack>
          )}
          <Stack spacing={1}>
            {notificationMessage.map((data, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  position: "relative",
                }}
                bgcolor={changeThem || colors.grey[100]}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="small"
                    style={{ color: "gray", fontSize: "13px" }}
                  >
                    {data.createdAt}
                  </Typography>
                  <IconButton onClick={() => handleDeleteNotification(index)}>
                    <ClearIcon />
                  </IconButton>
                </Stack>

                <Typography>{data.message}</Typography>

                {data.type === "warning" && (
                  <Stack direction="row" alignItems="center" mt={1}>
                    <WarningRoundedIcon sx={{ color: "#ff8f00" }} />
                    <Typography fontWeight="bold" sx={{ color: "#ff8f00" }}>
                      WARNING
                    </Typography>
                  </Stack>
                )}

                {data.type === "error" && (
                  <Stack direction="row" alignItems="center" mt={1}>
                    <WarningRoundedIcon sx={{ color: "red" }} />
                    <Typography fontWeight="bold" sx={{ color: "red" }}>
                      ERROR
                    </Typography>
                  </Stack>
                )}
                {changeThem && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        </Box>
      </Menu>

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
