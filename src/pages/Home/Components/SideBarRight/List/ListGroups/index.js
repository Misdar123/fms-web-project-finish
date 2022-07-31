import React, { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ListNoResult from "../ListNoResult";
import ListGroupNested from "./ListGroupNested";
import { useSelector } from "react-redux";

const ListGroups = ({open, onOpen}) => {
  const { groupDevice } = useSelector((state) => state.devices)

  const [openListGroupNested, setOpenListGroupNested] = useState(null);
  const [openPopUpListGroup, setOpenPopUpListGroup] = useState(false);

  return (
    <>
      <ListItemButton onClick={onOpen}>
        <ListItemIcon>
          <FormatListBulletedIcon />
        </ListItemIcon>
        <ListItemText primary="Groups" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {groupDevice.length !== 0 ? (
            groupDevice.map((data, index) => (
              //list group nested
              <ListGroupNested
                key={index}
                data={data}
                isListOpen={index === openListGroupNested}
                onClick={() => setOpenListGroupNested(index)}
                onDoubleClick={() => setOpenListGroupNested(null)}
                isOpenPopUpNestedList={openPopUpListGroup}
                setIsOpenPopUpNestedList={() =>
                  setOpenPopUpListGroup(!openPopUpListGroup)
                }
              />
            ))
          ) : (
            <ListNoResult title={"empty"} />
          )}
        </List>
      </Collapse>
    </>
  );
};

export default ListGroups;
