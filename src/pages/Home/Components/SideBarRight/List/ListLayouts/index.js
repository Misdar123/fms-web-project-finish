import React, { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { Button, IconButton, ListItem, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import ListChild from "./ListChild";
import ListNoResult from "../ListNoResult";
import { addDeviceDelete } from "../../../../../../redux/features/deviceSlice";
import { setIndexLayout } from "../../../../../../redux/features/layoutSlice";
import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ListLayouts = ({ open, onOpen }) => {
  const { layoutList } = useSelector((state) => state.layouts);
  const { userId } = useSelector((state) => state.user);
  const [selectIndexLayout, setSelectIndexLayout] = useState(0);
  const dispatch = useDispatch();

  const [openPopUp, setOpenPopUp] = useState(false);
  
  const handleOnClick = (index) => {
    dispatch(setIndexLayout(index));
    setSelectIndexLayout(index);
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  const handleDeletLayout = () => {
    const newLayouts = layoutList.filter(
      (layout) => layout.id !== layoutList[selectIndexLayout].id
    );
    const path = `users/${userId}/layouts/`;
    updateDataBase(path, newLayouts);
    dispatch(setIndexLayout(0));
  };

  return (
    <>
      <ListItemButton onClick={onOpen}>
        <ListItemIcon>
          <FormatListBulletedIcon />
        </ListItemIcon>
        <ListItemText primary="Layouts" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {layoutList.length !== 0 ? (
            layoutList.map((data, index) => (
              <ListItem key={index}>
                <Stack direction="row" alignItems="center">
                  <IconButton
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      handlePopUp();
                      handleOnClick(index);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <ListChild
                    listData={data}
                    onClick={() => handleOnClick(index)}
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
                        {`delete ${layoutList[selectIndexLayout]?.name}`}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handlePopUp}>cancel</Button>
                      <Button
                        onClick={() => {
                          handleDeletLayout();
                          setOpenPopUp(!openPopUp);
                        }}
                        autoFocus
                      >
                        ok
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Stack>
              </ListItem>
            ))
          ) : (
            <ListNoResult title="empty" />
          )}
        </List>
      </Collapse>
    </>
  );
};

export default ListLayouts;
