import React, { useState } from "react";
import {
  Grid,
  Card,
  Container,
  List,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  colors,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import { useContextApi } from "../../lib/hooks/useContexApi";
import { updateDataBase } from "../../lib/function/dataBaseCRUD";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const { currentUserId, changeThem } = useContextApi();
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const { user } = useSelector((state) => state.user);

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleUpdate = () => {
    updateDataBase("users/" + currentUserId + "/userName", newUserName);
  };

  return (
    <Container
      sx={{
        pt: 5,
        minHeight: window.innerHeight,
        backgroundColor: changeThem ?  "#0a1929" : colors.grey[100],
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "500px",
          height: "300px",
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
          <ListItemButton onClick={handleDialog}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Edite  Profile" />
          </ListItemButton>
        </List>
      </Card>

      <Dialog open={openDialog} onClose={handleDialog}>
        <DialogTitle>Edite Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="new user name"
            type="email"
            fullWidth
            variant="standard"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDialog();
              handleUpdate();
              setNewUserName("");
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProfile;
