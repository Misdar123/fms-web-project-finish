import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { List } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ListIconContainer from "./ListContainer";
import { useNavigate, useLocation } from "react-router-dom";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerLeft = ({ isOpen, setIsOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname;

  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const handleNavigation = (page) => {
    navigate(page);
  };

  return (
    <Drawer variant="permanent" open={isOpen}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <List sx={{ mt: 2 }}>
        {["Home", "Chart", "My Profile", "Settings"].map((text, index) => {
          let icon;
          switch (index) {
            case 0:
              icon = (
                <ListIconContainer
                  isOpen={isOpen}
                  title={text}
                  onClickButton={() => handleNavigation("/")}
                  isActive={path === "/"}
                >
                  <HomeIcon
                    sx={{
                      color: path === "/" ? "#FFF" : "dodgerblue",
                    }}
                  />
                </ListIconContainer>
              );
              break;
            case 1:
              icon = (
                <ListIconContainer
                  isOpen={isOpen}
                  title={text}
                  onClickButton={() => handleNavigation("Chart", index)}
                  isActive={path === "/Chart"}
                >
                  <BarChartRoundedIcon
                    sx={{
                      color: path === "/Chart" ? "#FFF" : "dodgerblue",
                    }}
                  />
                </ListIconContainer>
              );
              break;
            case 2:
              icon = (
                <ListIconContainer
                  isOpen={isOpen}
                  title={text}
                  onClickButton={() => handleNavigation("MyProfile", index)}
                  isActive={path === "/MyProfile"}
                >
                  <PersonIcon
                    sx={{
                      color: path === "/MyProfile" ? "#FFF" : "dodgerblue",
                    }}
                  />
                </ListIconContainer>
              );
              break;
            case 3:
              icon = (
                <ListIconContainer
                  isOpen={isOpen}
                  title={text}
                  onClickButton={() => handleNavigation("Settings", index)}
                  isActive={path === "/Settings"}
                >
                  <SettingsIcon
                    sx={{
                      color: path === "/Settings" ? "#FFF" : "dodgerblue",
                    }}
                  />
                </ListIconContainer>
              );
              break;
            default:
              break;
          }
          return (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              {icon}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default DrawerLeft;
