import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Button, Stack } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { ListItemButton, ListItemText } from "@mui/material";
import CardDrag from "../../../cardDrag";

import { useContextApi } from "../../../../../../lib/hooks/useContexApi";
import {
  updateDataBase,
  writeDataBase,
} from "../../../../../../lib/function/dataBaseCRUD";
import { useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ListGroupNested = ({ data, isListOpen, onClick, onDoubleClick }) => {
  const { currentUserId } = useContextApi();
  const { groupDevice } = useSelector((state) => state.devices);
  const { userId } = useSelector((state) => state.user);
  const [dragItems, setDragItems] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);

  useEffect(() => {
    setDragItems(data.devices || [])
  }, [groupDevice]);

  const handleDeleteDevice = (id) => {
    const groupData = groupDevice.find((group) => group.id === data.id);
    const newGroups = groupDevice.filter((group) => group.id !== data.id);

    const deviceInGroup = groupData.devices.filter(
      (device) => device.id !== id
    );

    const newGroup = {
      name: groupData.name,
      id: groupData.id,
      devices: deviceInGroup,
    };

    newGroups.push(newGroup);

    const path = `users/${userId}/groupDevices`;
    updateDataBase(path, newGroups);
  };

  const handleDeleteGroupList = () => {
    const result = groupDevice.filter((list) => list.id !== data.id);
    const path = `users/${currentUserId}/groupDevices`;
    writeDataBase(path, result);
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton onClick={handlePopUp}>
          <MoreVertIcon />
        </IconButton>

        {/* list group nested */}
        <ListItemButton onClick={onClick} onDoubleClick={onDoubleClick}>
          <ListItemText primary={data.name} />
          {isListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Stack>
      <Collapse in={isListOpen} timeout="auto" unmountOnExit>
        <Stack direction="row" mb={5} flexWrap="wrap" ml={5}>
          {dragItems &&
            dragItems.map((list, index) => (
              <CardDrag
                data={list}
                key={index}
                size={40}
                onClick={() => handleDeleteDevice(list.id)}
              />
            ))}
        </Stack>
      </Collapse>

      <Dialog
        open={openPopUp}
        onClose={handlePopUp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete {data.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopUp}>cancel</Button>
          <Button onClick={handleDeleteGroupList} autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListGroupNested;
