import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  colors,
  IconButton,
  Stack,
  Typography,
  Box,
  Collapse,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";

import { updateDataBase } from "../../../lib/function/dataBaseCRUD";
import { useContextApi } from "../../../lib/hooks/useContexApi";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";

import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

function DeviceProperties({ data }) {
  const { currentUserId } = useContextApi();
  const { allDevice } = useSelector((state) => state.devices);

  const [deviceName, setDeviceName] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [sendDataInterval, setSendDataInterval] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openModalDeleteDevice, setOpenModalDeleteDevice] = useState(false);

  const [isError, setIsError] = useState({ error: false, message: "" });

  const [deviceProperties, setDeviceProperties] = useState([]);

  const [displayAlert, setIsDisplayAlert] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const handleSubmit = () => {
    const newDevice = allDevice.slice();

    const target = newDevice.find((device) => device.id === data.id);
    const deviceTarget = { ...target };
    deviceTarget.deviceName = deviceName;
    deviceTarget.sendDataInterval = sendDataInterval;
    deviceTarget.properties = deviceProperties;

    const indexOfAllDevices = newDevice.map((device) => device.id);
    const indexOfDeviceTarget = indexOfAllDevices.indexOf(data.id);
    newDevice[indexOfDeviceTarget] = deviceTarget;

    const path = `users/${currentUserId}/devices`;
    updateDataBase(path, newDevice);

    setIsDisplayAlert({
      visible: true,
      type: "success",
      message: "update sucsess",
    });

    setTimeout(() => {
      setIsDisplayAlert({ visible: false, type: "success", message: "" });
    }, 2000);
  };

  const handleDeleteDevice = () => {
    const newDevice = [...allDevice];
    const deleteDevice = newDevice.filter((device) => device.id !== data.id);
    const path = `users/${currentUserId}/devices`;
    updateDataBase(path, deleteDevice);
  };

  const handleDeleteProperties = (ID) => {
    if (deviceProperties.length <= 1) return;
    const newProperties = deviceProperties.filter((data) => data.ID !== ID);
    setDeviceProperties(newProperties);
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    setDeviceName(data.deviceName);
    setMacAddress(data.macAddress);
    setSendDataInterval(data.sendDataInterval);
    const properties = [...data.properties];
    setDeviceProperties(properties);
  }, []);

  return (
    <Box
      component="div"
      sx={{
        marginBottom: "20px",
        minHeight: "50px",
        borderRadius: "5px",
        marginTop: "5px",
        padding: "5px",
      }}
    >
      <TextField
        error={isError.error}
        helperText={isError.message}
        autoFocus
        margin="dense"
        id="device name"
        label="device name"
        type="text"
        fullWidth
        variant="standard"
        value={deviceName}
        onChange={(e) => {
          setDeviceName(e.target.value);
          setIsError({ error: false, message: "" });
        }}
      />
      <TextField
        error={isError.error}
        helperText={isError.message}
        disabled
        autoFocus
        margin="dense"
        id="Mac Address"
        label="Mac Address"
        type="text"
        fullWidth
        variant="standard"
        value={macAddress}
        onChange={(e) => {
          setMacAddress(e.target.value);
          setIsError({ error: false, message: "" });
        }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} mt={5} spacing={1}>
        <Typography sx={{ fontWeight: "bold", width: "300px" }}>
          interval data
        </Typography>
        <Slider
          defaultValue={data.sendDataInterval}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={(e) => setSendDataInterval(e.target.value)}
        />
        <Typography>{sendDataInterval} minute</Typography>
      </Stack>

      {deviceProperties.map((data, index) => (
        <div key={index}>
          <Modal
            open={openModalDeleteDevice}
            onClose={() => setOpenModalDeleteDevice(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                backgroundColor: "#FFF",
                padding: "20px",
                borderRadius: "5px",
                minHeight: "200px",
                display: "flex",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => setOpenModalDeleteDevice(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleDeleteProperties(data.ID);
                  }}
                >
                  delete
                </Button>
              </Stack>
            </div>
          </Modal>
          <DevicePropertiesComponent
            handleDelete={() => {
              if (deviceProperties.length <= 1) return;
              setOpenDeleteModal(true);
            }}
            setDeviceProperties={setDeviceProperties}
            deviceProperties={deviceProperties}
            data={data}
            index={index}
          />
        </div>
      ))}

      {/* modal delete device */}

      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="description"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "#FFF",
            padding: "20px",
            borderRadius: "5px",
            minHeight: "200px",
            display: "flex",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleDeleteDevice();
                setOpenDeleteModal(false);
                console.log("sssss");
              }}
            >
              delete
            </Button>
          </Stack>
        </div>
      </Modal>

      <Stack
        direction="row"
        alignItems="center"
        mt={5}
        spacing={5}
        justifyContent="flex-end"
      >
        <Button onClick={() => setOpenDeleteModal(true)}>Delete</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </Stack>

      <Box sx={{ position: "absolute", bottom: -100, left: -100, zIndex: 5 }}>
        <Collapse in={displayAlert.visible}>
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
        </Collapse>
      </Box>
    </Box>
  );
}

const DevicePropertiesComponent = ({
  handleDelete,
  deviceProperties,
  setDeviceProperties,
  data,
  index,
}) => {
  const [expandModularType, setExpandModularType] = useState(null);
  const [showExpendIcon, setShowExpandIcon] = useState(false);

  const [modularType, setModularType] = useState("");
  const [IOType, setIOType] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensorLimit, setSensorLimit] = useState(0);

  useEffect(() => {
    setModularType(data.modularType);
    setIOType(data.IOType);
    setSensorType(data.sensorType);
    setSensorLimit(data.sensorLimit);
  }, []);

  const newDeviceProperties = {
    ID: Date.now(),
    modularType,
    IOType,
    sensorType,
    sensorLimit
  };

  useEffect(() => {
    deviceProperties[index] = newDeviceProperties;
    setDeviceProperties(deviceProperties);
  }, [modularType, IOType, sensorType, sensorLimit]);

  const handleChangeModularType = (event) => {
    setModularType(event.target.value);
    setExpandModularType(true);
  };

  const handleChangeIOType = (event) => {
    setIOType(event.target.value);
  };

  const handleChangeSensorType = (event) => {
    setSensorType(event.target.value);
  };

  const handleOpenAndCloseExpand = () => {
    if (modularType === null) return;
    setExpandModularType(!expandModularType);
  };

  return (
    <Stack mt={2} style={{border: "1px solid #e5e5e5", padding: "10px"}}>
      <Stack direction="row" mb={2} mt={2} spacing={2} pr={5}>
        <Typography sx={{ fontWeight: "bold" }}>Limit</Typography>
        <Slider
          defaultValue={10}
          value={sensorLimit}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={(e) => setSensorLimit(e.target.value)}
        />
        <Typography>{sensorLimit}</Typography>
      </Stack>
      <Stack
        spacing={1}
        direction={"row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">modular type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modularType}
            label="modular type"
            onChange={handleChangeModularType}
            sx={{ height: { xs: "30px", md: "50px" } }}
          >
            <MenuItem value={"Input"}>Input</MenuItem>
            <MenuItem value={"Output"}>Output</MenuItem>
          </Select>
        </FormControl>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton
            onClick={() => {
              handleOpenAndCloseExpand();
              setShowExpandIcon(!showExpendIcon);
            }}
          >
            {showExpendIcon ? (
              <ExpandMoreOutlinedIcon />
            ) : (
              <ExpandLessOutlinedIcon />
            )}
          </IconButton>
          <IconButton onClick={handleDelete} sx={{ color: colors.red[500] }}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      {expandModularType && (
        <Stack
          spacing={1}
          direction={{ xs: "column", sm: "row" }}
          mt={2}
          alignItems="center"
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">IO Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={IOType}
              label="IO Type"
              onChange={handleChangeIOType}
              sx={{ height: { xs: "30px", md: "50px" } }}
            >
              <MenuItem value={"Digital"}>Digital</MenuItem>
              <MenuItem value={"Analog"}>Analog</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {expandModularType && (
        <Stack
          spacing={1}
          direction={{ xs: "column", sm: "row" }}
          mt={2}
          alignItems="center"
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">sensor type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sensorType}
              label="Sensor Type"
              onChange={handleChangeSensorType}
              sx={{ height: { xs: "30px", md: "50px" } }}
            >
              <MenuItem value={"Temperature"}>Temperature</MenuItem>
              <MenuItem value={"Humidity"}>Humidity</MenuItem>
              <MenuItem value={"Vibration"}>Vibration</MenuItem>
              <MenuItem value={"Presure"}>Presure</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};

export default DeviceProperties;
