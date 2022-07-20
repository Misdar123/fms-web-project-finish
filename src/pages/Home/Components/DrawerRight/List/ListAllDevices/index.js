import React, { useState } from "react";
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

const ListAllDevices = ({ onOpen, open }) => {
  const { allDevice } = useSelector((state) => state.devices);
  const { userId } = useSelector((state) => state.user);
  const dragItems = allDevice;
  const [openPopUp, setOpenPopUp] = useState(false);

  const deleteDevice = (id) => {
    const result = allDevice.filter((device) => device.id !== id);
    const path = `users/${userId}/devices`;
    updateDataBase(path, result);
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

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
                  <CardDrag
                    data={data}
                    key={index}
                    onClick={handlePopUp}
                  />

                  <Dialog
                    open={openPopUp}
                    onClose={handlePopUp}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title"></DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        are you sure want to delete this device?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handlePopUp}>cancle</Button>
                      <Button onClick={() => deleteDevice(data.id)} autoFocus>
                        ok
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              ))
            ) : (
              <ListNoResult title={"no devices"} />
            )}
          </Stack>
        </List>
        <Divider />
      </Collapse>
    </>
  );
};

export default ListAllDevices;
