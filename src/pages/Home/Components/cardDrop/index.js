import React, { useState, useRef, useEffect } from "react";
import {
  updateDataBase,
  readDataBase,
} from "../../../../lib/function/dataBaseCRUD";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
} from "@mui/material";
import { Slider } from "@mui/material";
import { useSelector } from "react-redux";
import { useContextApi } from "../../../../lib/hooks/useContexApi";
import DeviceComponent from "../deviceComponent";

const CardDrop = ({
  item,
  onClick = () => null,
  onDoubleClick = () => null,
  isActive,
}) => {
  const { changeThem } = useContextApi();
  const { publicDevice } = useSelector((state) => state.devices);
  const control = publicDevice[item?.macAddress]?.control || {};
  const divOverlay = useRef();

  const [offset, setOffset] = useState([100, 100]);
  const [isDown, setIsDown] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rangeTimer, setRangeTimer] = useState(10);
  const [rangeLog, setRangeLog] = useState(10);
  const [showSensorValue, setShowSensorValue] = useState(false);

  const defaultRangeTimer = parseInt(control.rangeTimer);
  const defaultRangeLog = parseInt(control.rangeLog);

  const openPopUpSettingDevice = Boolean(anchorEl);

  const handleOpenPopUpSettingDevice = (event) => {
    if (event.button === 2) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSaveSettingToDataBase = () => {
    updateDataBase(`devices/${item.macAddress}/control/rangeTimer`, rangeTimer);
    updateDataBase(`devices/${item.macAddress}/control/rangeLog`, rangeLog);
  };

  const handleClosePopUpSettingDevice = () => {
    setAnchorEl(null);
  };

  const handleMouseDown = (e) => {
    if (!isActive) return;
    setIsDown(true);
    setOffset([
      divOverlay.current.offsetLeft - e.clientX,
      divOverlay.current.offsetTop - e.clientY,
    ]);
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    setIsDown(false);
  };

  const savePositionToLocalStorage = (left, top) => {
    localStorage.setItem(
      item.macAddress,
      JSON.stringify({
        position: {
          left: left,
          top: top,
        },
      })
    );
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!isActive) return;

    if (
      e.clientY + offset[1] > window.screen.innerHeight - 300 ||
      e.clientX + offset[0] > window.screen.innerWidth * 0.6
    )
      return;
    if (e.clientX + offset[0] < 0 || e.clientY + offset[1] < 0) return;

    if (isDown) {
      divOverlay.current.style.left = e.clientX + offset[0] + "px";
      divOverlay.current.style.top = e.clientY + offset[1] + "px";
    }
    savePositionToLocalStorage(
      divOverlay.current.style.left,
      divOverlay.current.style.top
    );
  };

  const downloadLogFileTxt = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [Object.values(deviceData.sensor[0].log).join("\n")],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = "log.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    const path = `devices/${item.macAddress}/control/TX`;
    const data = isSwitchOn ? 0 : 1;
    updateDataBase(path, data);
  };

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem(item.macAddress));

    if (result !== null) {
      divOverlay.current.style.left = result.position.left;
      divOverlay.current.style.top = result.position.top;
    } else {
      divOverlay.current.style.left = "100px";
      divOverlay.current.style.top = "100px";
    }
  }, []);

  useEffect(() => {
    const path = `devices/${item.macAddress}`;
    readDataBase(path, (data) => {
      setDeviceData(data);
    });
  }, []);

  useEffect(() => {
    setIsSwitchOn(control?.TX);
    setRangeTimer(control?.rangeTimer);
    setRangeLog(control?.rangeLog);
  }, []);

  return (
    <>
      <div
        ref={divOverlay}
        onMouseDown={(e) => {
          handleMouseDown(e);
          handleOpenPopUpSettingDevice(e);
        }}
        onMouseOver={() => setShowSensorValue(true)}
        onDoubleClick={onDoubleClick}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setShowSensorValue(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onClick={onClick}
        onTouchStart={onClick}
        style={{ position: "absolute" }}
      >
        <DeviceComponent
          deviceStyle={{ border: isActive ? "2px solid dodgerblue" : "none" }}
          topLeftStyles={{
            backgroundColor: item.properties[0] ? "#ab30e4" : "#000",
          }}
          topRightStyles={{
            backgroundColor: item.properties[1] ? "#ff9925" : "#000",
          }}
          bottomLeftStyles={{
            backgroundColor: item.properties[2] ? "#353535" : "#000",
          }}
          botomRightStyles={{
            backgroundColor: item.properties[3] ? "#34dd9f" : "#000",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            minHeight: "150px",
            minWidth: "250px",
          }}
        >
          {showSensorValue &&
            deviceData?.sensor.map((data, index) => (
              <small
                key={index}
                style={{
                  color: isSwitchOn ? (changeThem ? "white" : "gray") : "red",
                }}
              >
                {data.sensorName} : {data.value}
              </small>
            ))}
        </div>
      </div>

      {/* device settings */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openPopUpSettingDevice}
        onClose={handleClosePopUpSettingDevice}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack>
          <MenuItem>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={5}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <ListItemText>{isSwitchOn ? "on" : "off"}</ListItemText>
                <Switch
                  checked={Boolean(isSwitchOn)}
                  onChange={handleSwitch}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Stack>

              <Button variant="outlined" onClick={downloadLogFileTxt}>
                log.txt
              </Button>
            </Stack>
          </MenuItem>
          <Divider />
          <MenuItem>
            <Stack>
              <ListItemText>send data interval</ListItemText>
              <ListItemIcon>
                <Slider
                  sx={{ width: "200px" }}
                  defaultValue={defaultRangeTimer ? defaultRangeTimer : 10}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  max={24}
                  min={1}
                  onChange={(e) => setRangeTimer(e.target.value)}
                  marks={[{ value: 58, label: "hours" }]}
                  key={1}
                />
              </ListItemIcon>
            </Stack>
          </MenuItem>
          <MenuItem>
            <Stack>
              <ListItemText>log range</ListItemText>
              <ListItemIcon>
                <Slider
                  sx={{ width: "200px" }}
                  defaultValue={defaultRangeLog ? defaultRangeLog : 10}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  min={10}
                  max={100}
                  onChange={(e) => setRangeLog(e.target.value)}
                />
              </ListItemIcon>
            </Stack>
          </MenuItem>
          <Stack direction="row" justifyContent="space-between" mt={5}>
            <Button onClick={handleClosePopUpSettingDevice}>cancel</Button>
            <Button
              onClick={() => {
                handleSaveSettingToDataBase();
                handleClosePopUpSettingDevice();
              }}
            >
              save
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
};

export default CardDrop;
