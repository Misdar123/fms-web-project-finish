import React from "react";
import { Card, List, colors } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { useSelector } from "react-redux";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const MyProfile = () => {
  const { changeThem } = useContextApi();
  const { user } = useSelector((state) => state.user);
  return (
    <div
      style={{
        paddingTop: "50px",
        minHeight: "100vh",
        backgroundColor: changeThem ? "#0a1929" : colors.grey[100],
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: {xs: "290px", sm: "400px", md:"500px"},
          height: {xs: "250px", sm: "300px"},
        }}
      >
        <h1 style={{ textAlign: "center" }}>My Profile</h1>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={user?.userName} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={user?.email} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <LocalPhoneIcon />
            </ListItemIcon>
            <ListItemText primary="+62813-1678-3223" />
          </ListItemButton>
        </List>
      </Card>
    </div>
  );
};

export default MyProfile;
