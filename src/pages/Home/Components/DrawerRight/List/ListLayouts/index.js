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
import { IconButton, ListItem, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import ListChild from "./ListChild";
import ListNoResult from "../ListNoResult";
import { addDeviceDelete } from "../../../../../../redux/features/deviceSlice";
import { setIndexLayout } from "../../../../../../redux/features/layoutSlice";
import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";

const ListLayouts = ({ open, onOpen }) => {
  const { layoutList } = useSelector((state) => state.layouts);
  const { userId } = useSelector((state) => state.user);
  const [selectIndexLayout, setSelectIndexLayout] = useState(0);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOnClick = (index) => {
    dispatch(setIndexLayout(index));
    setSelectIndexLayout(index);
    dispatch(addDeviceDelete(null));
  };

  const handleDeletLayout = () => {
    const newLayouts = layoutList.filter(
      (layout) => layout.id !== layoutList[selectIndexLayout].id
    );
    const path = `users/${userId}/layouts/`;
    updateDataBase(path, newLayouts);
    handleCloseMenu();
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
                      handleOpenMenu(e);
                      handleOnClick(index);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <ListChild
                    listData={data}
                    onClick={() => handleOnClick(index)}
                  />
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <List>
                      <ListItemButton onClick={handleDeletLayout}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`delete ${layoutList[selectIndexLayout]?.name}`}
                        />
                      </ListItemButton>
                    </List>
                  </Menu>
                </Stack>
              </ListItem>
            ))
          ) : (
            <ListNoResult title="belum ada layout" />
          )}
        </List>
      </Collapse>
    </>
  );
};

export default ListLayouts;
