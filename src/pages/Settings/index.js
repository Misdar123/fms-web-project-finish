import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useContextApi } from "../../lib/hooks/useContexApi";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { colors } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import KeyIcon from "@mui/icons-material/Key";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import CallSharpIcon from "@mui/icons-material/CallSharp";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 55,
  height: 27,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 25,
    height: 25,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const Cardontainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    minWidth: "400px",
  },
  [theme.breakpoints.up("sm")]: {
    minWidth: "500px",
  },
}));

const Settings = () => {
  const { changeThem, setChangeThem } = useContextApi();
  const [openThemSetting, setOpenThemSetting] = useState(true);
  const [openDeviceSetting, setOpenDeviceSetting] = useState(true);
  const [openProfileSetting, setOpenProfileSetting] = useState(true);

  const handleOpenThemSettings = () => {
    setOpenThemSetting(!openThemSetting);
  };

  const handleOpenDeviceSettings = () => {
    setOpenDeviceSetting(!openDeviceSetting);
  };

  const handleOpenProfileSettings = () => {
    setOpenProfileSetting(!openProfileSetting);
  };

  const handleChangeThem = () => {
    setChangeThem((them) => !them);
    localStorage.setItem("THEM", `${!changeThem}`);
  };

  return (
    <div
      style={{
        paddingTop: "50px",
        minHeight: window.innerHeight,
        backgroundColor: changeThem ? "#0a1929" : colors.grey[100],
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Cardontainer>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <h1 style={{ textAlign: "center" }}>Settings</h1>
            </ListSubheader>
          }
        >
          {/* them setting */}

          <ListItemButton onClick={handleOpenThemSettings}>
            <ListItemIcon>
              <ColorLensIcon />
            </ListItemIcon>
            <ListItemText primary="Change Them" />
            {openThemSetting ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openThemSetting} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <FormControlLabel
                    onChange={handleChangeThem}
                    control={<MaterialUISwitch checked={changeThem} />}
                  />
                </ListItemIcon>
                <ListItemText primary={changeThem ? "Light" : "Dark"} />
              </ListItemButton>
            </List>
          </Collapse>

          {/* device settings */}

          <ListItemButton onClick={handleOpenDeviceSettings}>
            <ListItemIcon>
              <DevicesRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Devices" />
            {openDeviceSetting ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDeviceSetting} timeout="auto" unmountOnExit>
            <div
              style={{
                marginLeft: "50px",
                marginRight: "25px",
                border: "1px solid #f3f3f3",
                minHeight: "50px",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <List component="div" disablePadding>
                <ListItemButton>
                  <DevicesRoundedIcon />
                </ListItemButton>
              </List>
            </div>
          </Collapse>

          {/* profile setting */}

          <ListItemButton onClick={handleOpenProfileSettings}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
            {openProfileSetting ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openProfileSetting} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <KeyIcon />
                </ListItemIcon>
                <ListItemText>Reset Password</ListItemText>
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <ManageAccountsSharpIcon />
                </ListItemIcon>
                <ListItemText>Change User Name</ListItemText>
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }}>
                <ListItemIcon>
                  <CallSharpIcon />
                </ListItemIcon>
                <ListItemText>Change Phone Number</ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Cardontainer>
    </div>
  );
};

export default Settings;
