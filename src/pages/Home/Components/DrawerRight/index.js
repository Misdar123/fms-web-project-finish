import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Divider } from "@mui/material";
import DesignBoard from "./DesignBoard";
import DevicesBoard from "./DevicesBoard";

import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const DrawerRight = ({ printComponentRef }) => {
  const drawerWidth = 250;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={true}
    >
      <List
        sx={{
          mt: "30%",
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Design" />
          <Tab label="Devices" />
        </Tabs>

        <Divider />

        {value === 0 ? (
          <DesignBoard printComponentRef={printComponentRef} />
        ) : (
          <DevicesBoard />
        )}
      </List>
    </Drawer>
  );
};

export default DrawerRight;
