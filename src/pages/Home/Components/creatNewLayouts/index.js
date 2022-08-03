import React, { useState } from "react";
import { updateDataBase } from "../../../../lib/function/dataBaseCRUD";
import { useContextApi } from "../../../../lib/hooks/useContexApi";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { insertLayout } from "../../../../redux/features/layoutSlice";

export default function CreatNewLayout({ openPopUp, setOpenPopUp }) {
  const { currentUserId } = useContextApi();
  const [layoutName, setLayoutName] = useState("");
  const { layoutList } = useSelector((state) => state.layouts);
  const dispatch = useDispatch();

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
    setLayoutName("");
  };

  const handleCreateLayout = () => {
    const path = `users/${currentUserId}/layouts`;
    const newLayout = [...layoutList];
    const newLayoutProperties = {
      id: Date.now(),
      name: layoutName,
    };
    newLayout.push(newLayoutProperties);

    updateDataBase(path, newLayout);
    dispatch(insertLayout(newLayout));
  };

  return (
    <Dialog
      open={openPopUp}
      onClose={handlePopUp}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle textAlign="center" id="alert-dialog-title">
        Layout Name
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Stack sx={{ pt: 1 }} spacing={2}>
            <TextField
              id="outlined-basic"
              label="name"
              variant="outlined"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
            />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePopUp}>cancel</Button>
        <Button
          onClick={() => {
            handleCreateLayout();
            handlePopUp();
          }}
          autoFocus
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
