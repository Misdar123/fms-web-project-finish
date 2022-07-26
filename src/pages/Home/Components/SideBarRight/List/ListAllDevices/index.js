import React, { useEffect, useState } from "react";
import { Divider, Stack } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSelector } from "react-redux";

import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";
import CardDrag from "../../../cardDrag";
import ListNoResult from "../ListNoResult";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import { useContextApi } from "../../../../../../lib/hooks/useContexApi";

const ListAllDevices = ({ onOpen, open }) => {
  const { currentUserId, deviceInGroups } = useContextApi();
  const { allDevice, groupDevice } = useSelector((state) => state.devices);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [dragItems, setDragItems] = useState([]);

  const deleteDevice = (id) => {
    const result = allDevice.filter((device) => device.id !== id);
    const path = `users/${currentUserId}/devices`;
    updateDataBase(path, result);
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  // filter data by device group
  useEffect(() => {
    const deviceInGroup = [];
    groupDevice.forEach((item) => {
      if (item.devices !== undefined) {
        deviceInGroup.push(...item.devices);
      }
    });

    if (deviceInGroup.length !== 0) {
      let result = allDevice;
      deviceInGroup.forEach((device) => {
        result = result.filter((value) => value.id !== device.id);
      });
      setDragItems(result);
    } else {
      setDragItems(allDevice);
    }
  }, [allDevice, deviceInGroups]);

  return (
    <>
      <ListItemButton onClick={onOpen}>
        <ListItemIcon>
          <FormatListBulletedIcon />
        </ListItemIcon>
        <ListItemText primary="Devices" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Stack direction="row" flexWrap="wrap" pb={5}>
            {dragItems.length !== 0 ? (
              dragItems.map((data, index) => (
                <div key={index}>
                  <CardDrag data={data} key={index} onClick={handlePopUp} />

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
                      <Button
                        onClick={() => {
                          deleteDevice(data.id);
                          handlePopUp();
                        }}
                        autoFocus
                      >
                        ok
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              ))
            ) : (
              <ListNoResult title={"Empty"} />
            )}
          </Stack>
        </List>
        <Divider />
      </Collapse>
    </>
  );
};

export default ListAllDevices;
