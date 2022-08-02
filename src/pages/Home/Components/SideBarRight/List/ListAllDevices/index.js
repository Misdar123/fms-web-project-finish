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
import { useDispatch, useSelector } from "react-redux";

import CardDrag from "../../../cardDrag";
import ListNoResult from "../ListNoResult";

import { useContextApi } from "../../../../../../lib/hooks/useContexApi";
import { setIndexLayout } from "../../../../../../redux/features/layoutSlice";

const ListAllDevices = ({ onOpen, open }) => {
  const { deviceInGroups, setSelecIndexOfLayout } = useContextApi();
  const { allDevice, groupDevice } = useSelector((state) => state.devices);
  const [dragItems, setDragItems] = useState([]);
  const { layoutList } = useSelector((state) => state.layouts);
  const dispatch = useDispatch();

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

  const handleSelectFindLayoutOnClick = (value) => {
    const newLayouts = [...layoutList];
    let indexLayout = null;

    newLayouts.forEach((data, index) => {
      if (Array.isArray(data.devices)) {
        const result = data.devices
          .map((device) => device.macAddress)
          .includes(value.macAddress);

        if (result) {
          indexLayout = index;
          return;
        }
      }
    });
    setSelecIndexOfLayout(indexLayout);
    dispatch(setIndexLayout(indexLayout));
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
                    onDoubleClick={() => handleSelectFindLayoutOnClick(data)}
                  />
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
