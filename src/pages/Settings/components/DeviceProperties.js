import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { colors, IconButton, Stack, Typography } from "@mui/material";
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

  const [isError, setIsError] = useState({ error: false, message: "" });

  const [deviceProperties, setDeviceProperties] = useState([]);

  const handleSubmit = () => {
    const newDevice = allDevice.slice()
    
    const target = newDevice.find((device) => device.id === data.id)
    const deviceTarget = {...target}
    deviceTarget.name = deviceName
    deviceTarget.sendDataInterval = sendDataInterval
    deviceTarget.properties = deviceProperties
  
    const indexOfAllDevices = newDevice.map((device) => device.id)
    const indexOfDeviceTarget = indexOfAllDevices.indexOf(data.id)
    newDevice[indexOfDeviceTarget] = deviceTarget

    const path = `users/${currentUserId}/devices`;
    updateDataBase(path, newDevice)
  };

  const handleDeleteProperties = (ID) => {
    if (deviceProperties.length <= 1) return;
    const newProperties = deviceProperties.filter((data) => data.ID !== ID);
    setDeviceProperties(newProperties);
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    setDeviceName(data.name);
    setMacAddress(data.macAddress);
    setSendDataInterval(data.sendDataInterval);
    const properties = [...data.properties];
    setDeviceProperties(properties);
  }, []);

  return (
    <div
      style={{
        marginBottom: "20px",
        marginLeft: "50px",
        marginRight: "25px",
        border: "1px solid #e3e3e3",
        minHeight: "50px",
        borderRadius: "5px",
        marginTop: "5px",
        padding: "10px",
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

      <Stack direction="row" mt={5} spacing={2}>
        <Typography sx={{ fontWeight: "bold", width: "300px" }}>
          send data interval :
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
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
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
                  onClick={() => setOpenDeleteModal(false)}
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

      <Stack
        direction="row"
        alignItems="center"
        mt={5}
        justifyContent="flex-end"
      >
        <Button onClick={handleSubmit}>Update</Button>
      </Stack>
    </div>
  );
}

const DevicePropertiesComponent = ({
  handleDelete,
  deviceProperties,
  setDeviceProperties,
  data,
  index
}) => {
  const [expandModularIO, setExpandModularIO] = useState(null);
  const [expandIOType, setExpandIOType] = useState(null);
  const [showExpendIcon, setShowExpandIcon] = useState(false);

  const [modularIO, setModularIO] = useState("");
  const [IOType, setIOType] = useState("");
  const [sensorType, setSensorType] = useState("");

  useEffect(() => {
    setModularIO(data.modularIO);
    setIOType(data.IOType);
    setSensorType(data.sensorType);
  }, []);

  const newDeviceProperties = {
    ID: Date.now(),
    modularIO,
    IOType,
    sensorType,
  };

  useEffect(() => {
    deviceProperties[index] = newDeviceProperties;
    setDeviceProperties(deviceProperties);
  }, [modularIO, IOType, sensorType]);

  const handleChangeModularIO = (event) => {
    setModularIO(event.target.value);
    setExpandModularIO(true);
  };

  const handleChangeIOType = (event) => {
    setIOType(event.target.value);
    setExpandIOType(true);
  };

  const handleChangeSensorType = (event) => {
    setSensorType(event.target.value);
  };

  const handleOpenAndCloseExpand = () => {
    if (modularIO === null) return;
    setExpandIOType(!expandIOType);
    setExpandModularIO(!expandModularIO);
  };

  return (
    <Stack
      mt={2}
      p={1}
      style={{
        border: "1px solid #e3e3e3",
        borderRadius: "10px",
      }}
    >
      <Stack spacing={1} direction="row" alignItems="center">
        <Typography>Modular I/O </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">modular type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modularIO}
            label="modular type"
            onChange={handleChangeModularIO}
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

      {expandModularIO && (
        <Stack spacing={1} direction="row" mt={2} alignItems="center">
          <Typography sx={{ width: "80px" }}>I/O Type :</Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">IO Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={IOType}
              label="IO Type"
              onChange={handleChangeIOType}
            >
              <MenuItem value={"Digital"}>Digital</MenuItem>
              <MenuItem value={"Analog"}>Analog</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {expandIOType && (
        <Stack spacing={1} direction="row" mt={2} alignItems="center">
          <Typography sx={{ width: "80px" }}>Sensor Type</Typography>
          <FormControl sx={{ minWidth: "280px" }}>
            <InputLabel id="demo-simple-select-label">sensor type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sensorType}
              label="Sensor Type"
              onChange={handleChangeSensorType}
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
