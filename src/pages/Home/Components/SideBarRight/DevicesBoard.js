import React, { useState } from "react";
import { Divider } from "@mui/material";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import FormNewGroup from "./Form/FormNewGroup";
import FormNewDevice from "./Form/FormNewDevice";

import ListAllDevices from "./List/ListAllDevices";
import ListGroups from "./List/ListGroups";
import ListLayouts from "./List/ListLayouts";
import { useSelector } from "react-redux";

const DevicesBoard = () => {
  const { groupDevice } = useSelector((state) => state.devices);
  const { layoutList } = useSelector((state) => state.layouts);
  const [openListGroup, setOpenListGroup] = useState(false);
  const [openListDevices, setOpenListDevices] = useState(true);
  const [openListLayout, setOpenListLayout] = useState(false);

  const [openPopUpNewGroup, setOpenPopUpNewGroup] = useState(false);
  const [openPopUpNewDevice, setOpenPopUpNewDevice] = useState(false);

  return (
    <>
      {/* form pop up */}
      <FormNewGroup
        openDialog={openPopUpNewGroup}
        setOpenDialog={setOpenPopUpNewGroup}
      />

      <FormNewDevice
        openDialog={openPopUpNewDevice}
        setOpenDialog={setOpenPopUpNewDevice}
      />
      {/* list devices */}
      <ListAllDevices
        onOpen={() => setOpenListDevices(!openListDevices)}
        open={openListDevices}
      />

      {/* list group */}
      <ListGroups
        onOpen={() => setOpenListGroup(!openListGroup)}
        open={openListGroup}
      />

      {/* list Layout */}
      <ListLayouts
        onOpen={() => setOpenListLayout(!openListLayout)}
        open={openListLayout}
      />

      <Divider />
      {/* new devices */}
      <ListItemButton
        onClick={() => setOpenPopUpNewDevice(!openPopUpNewDevice)}
      >
        <ListItemIcon>
          <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText primary="New Devices" />
      </ListItemButton>

      {/*  new group */}
      <ListItemButton onClick={() => setOpenPopUpNewGroup(!openPopUpNewGroup)}>
        <ListItemIcon>
          <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText primary="New Group" />
      </ListItemButton>
    </>
  );
};

export default DevicesBoard;
