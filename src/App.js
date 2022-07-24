import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./lib/config/firebase";
import { ContextApi } from "./lib/helper/ContextApi";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import NoPage from "./pages/NoPage404";
import SignIn from "./pages/Auth/SignIn";
import LoadingPage from "./Navigations/LoadingPage";
import Settings from "./pages/Settings";
import MyProfile from "./pages/Profile";
import Layout from "./Layout";
import TestPage from "./pages/TestPage/Testpage";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { readDataBase } from "./lib/function/dataBaseCRUD";
import { stringRegex } from "./lib/function/stringRegex";
import { useDispatch } from "react-redux";
import { insertLayout } from "./redux/features/layoutSlice";
import { insertUsers } from "./redux/features/usersSlice";
import {
  insertAllDevice,
  insertGroupDevice,
  insertPublicDevice,
} from "./redux/features/deviceSlice";
import Chart from "./pages/Chart";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [icons, setIcons] = useState([]);
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [dropDevice, setDropDevice] = useState([]);
  const [isDisplayAlert, setIsDisplayAlert] = useState({
    isError: false,
    message: "",
    type: "error",
  });
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [images, setImages] = useState([]);
  const [textDraw, setTextDraw] = useState([]);
  const [zoomSquare, setZoomSquare] = useState(1);

  const [deviceInGroups, setDeviceInGroups] = useState([]);

  const them = JSON.parse(localStorage.getItem("THEM"));
  const [changeThem, setChangeThem] = useState(them);

  const dispatch = useDispatch();

  const getDataFromDataBase = (data) => {
    dispatch(insertAllDevice(data?.devices || []));
    dispatch(insertGroupDevice(data?.groupDevices || []));
    dispatch(insertUsers(data));
    dispatch(insertLayout(data?.layouts || []));
    setCurrentUserId(stringRegex(data?.email));
    setIsDataAvaliable(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        const path = "users/" + stringRegex(user.email);
        readDataBase(path, getDataFromDataBase);
        readDataBase("icons/", setIcons);
        readDataBase("devices/", (data) => {
          dispatch(insertPublicDevice(data));
        });
        setIsAuth(true);
      } else {
        setIsDataAvaliable(true);
      }
    });
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      mode: changeThem ? "dark" : "light",
    },
  });

  // useEffect(() => {
  //   const path = `users/${currentUserId}/groupDevices`;
  //   readDataBase(path, (result) => {
  //     const devices = [];
  //     result
  //       .map((value) => value.devices)
  //       .forEach((data) => data !== undefined && devices.push(...data));
  //     setDeviceInGroups(devices);
  //   });
  // }, []);

  if (!isDataAvaliable) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ContextApi.Provider
        value={{
          isAuth,
          setIsAuth,
          currentUserId,
          icons,
          isDisplayAlert,
          setIsDisplayAlert,
          dropDevice,
          setDropDevice,
          rectangles,
          setRectangles,
          circles,
          setCircles,
          images,
          setImages,
          textDraw,
          setTextDraw,
          zoomSquare,
          setZoomSquare,
          changeThem,
          setChangeThem,
          deviceInGroups,
          setDeviceInGroups,
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            {isAuth ? (
              <Layout>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="Chart" element={<Chart />} />
                  <Route path="Settings" element={<Settings />} />
                  <Route path="MyProfile" element={<MyProfile />} />
                  <Route path="Test" element={<TestPage />} />
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </Layout>
            ) : (
              <Routes>
                <Route index element={<Login />} />
                <Route path="SignIn" element={<SignIn />} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            )}
          </BrowserRouter>
        </DndProvider>
      </ContextApi.Provider>
    </ThemeProvider>
  );
}

export default App;
