import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";

import DeviceComponent from "../../../deviceComponent";

import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";
import { useContextApi } from "../../../../../../lib/hooks/useContexApi";

export default function FormNewGroup({ openDialog, setOpenDialog }) {
  const { allDevice, groupDevice } = useSelector((state) => state.devices);
  const { currentUserId } = useContextApi();
  const [groupName, setGroupName] = useState("");
  const [checked, setChecked] = useState([]);

  // const updateListAllDevice = () => {
  //   let newDevice = [...allDevice]
  //   checked.forEach((value) => {
  //     newDevice = newDevice.filter((device) => device.id !== value.id)
  //   });
  //   const path = `users/${currentUserId}/devices`
  //   updateDataBase(path, newDevice)
  // };

  const creatGroup = () => {
    const oldGroup = groupDevice;
    const path = `users/${currentUserId}/groupDevices`;
    const data = { name: groupName, id: Date.now(), devices: checked };
    updateDataBase(path, [...oldGroup, data]);
    setChecked([]);
  };

  const handleSubmit = () => {
    if (groupName === "") return;
    if (checked.length === 0) {
      alert("please select device");
      return;
    }
    creatGroup();
    // updateListAllDevice()
    setOpenDialog(!openDialog);
    setGroupName("");
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
        <DialogTitle>Group</DialogTitle>
        <DialogContent sx={{ minWidth: "400px" }}>
          <TextField
            autoFocus
            margin="dense"
            id="group name"
            label="group name"
            type="text"
            fullWidth
            variant="standard"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          {allDevice.length !== 0 ? (
            <Typography sx={{ pt: 5 }}> pilih device </Typography>
          ) : (
            <Typography sx={{ pt: 5 }}> belum ada device </Typography>
          )}

          <List
            dense
            sx={{ width: "100%", maxWidth: 300, bgcolor: "background.paper" }}
          >
            {allDevice.length !== 0 &&
              allDevice.map((value, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={checked.indexOf(value) !== -1}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    }
                    disablePadding
                  >
                    <ListItemButton>
                      <DeviceComponent deviceStyle={{marginRight: "5px"}}/>
                      <ListItemText id={labelId} primary={value.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(!openDialog)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
