import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { colors, IconButton, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";
import { useContextApi } from "../../../../../../lib/hooks/useContexApi";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";

import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

function FormNewDevice({ openDialog, setOpenDialog }) {
  const { currentUserId } = useContextApi();
  const { allDevice, publicDevice } = useSelector((state) => state.devices);

  const publicMacAddress = Object.keys(publicDevice);
  const [deviceName, setDeviceName] = useState("");
  const [macAddress, setMacAddress] = useState("");

  const [sendDataInterval, setSendDataInterval] = useState(10);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [isError, setIsError] = useState({ error: false, message: "" });

  const [deviceProperties, setDeviceProperties] = useState([
    {
      ID: Date.now(),
      modularType: "",
      IOType: "",
      sensorType: "",
      sensorMaxValue: 0,
    },
  ]);

  const handleSubmit = () => {
    const oldDevices = allDevice;

    if (deviceName === "" || macAddress === "") {
      setIsError({ error: true, message: "tidak boleh kosong" });
      return;
    }

    const isMacAddressAlreadyUsed = oldDevices.find(
      (device) => device.macAddress === macAddress
    );

    if (isMacAddressAlreadyUsed) {
      setIsError({ error: true, message: "mac address sudah digunakan" });
      return;
    }

    if (!publicMacAddress.includes(macAddress)) {
      setIsError({ error: true, message: "mac address belum terdaftar" });
      return;
    }

    const checkIsDevicePropertiesEmpty = () => {
      let result = false;
      deviceProperties.forEach((device) => {
        if (
          device.modularType === "" ||
          device.IOType === "" ||
          device.sensorType === "" ||
          device.sensorMaxValue === 0
        ) {
          alert("device properties can't empty");
          result = true;
        }
      });
      return result;
    };

    if (checkIsDevicePropertiesEmpty() || deviceProperties.length === 0) return;

    const path = `users/${currentUserId}/devices`;
    const data = {
      id: Date.now(),
      deviceName: deviceName,
      macAddress,
      sendDataInterval,
      properties: deviceProperties,
      position: { top: "", left: "" },
    };

    updateDataBase(path, [...oldDevices, data]).then(() => {
      setOpenDialog(!openDialog);
      setDeviceName("");
      setMacAddress("");
      setDeviceProperties([{}]);
      setSendDataInterval(0);
    });
  };

  const handleDeleteProperties = (ID) => {
    if (deviceProperties.length <= 1) return;
    const newProperties = deviceProperties.filter((data) => data.ID !== ID);
    setDeviceProperties(newProperties);
    setOpenDeleteModal(false);
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(!openDialog);
          setDeviceProperties([{}]);
          setSendDataInterval(0);
        }}
        fullWidth
      >
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
        >
          <DialogTitle>Add Device</DialogTitle>
        </Stack>
        <DialogContent>
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
              defaultValue={10}
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
                index={index}
              />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(!openDialog);
              setDeviceProperties([{}]);
              setSendDataInterval(0);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DevicePropertiesComponent = ({
  handleDelete,
  deviceProperties,
  setDeviceProperties,
  index,
}) => {
  const [expandModularType, setExpandModularType] = useState(null);
  const [expandIOType, setExpandIOType] = useState(null);
  const [showExpendIcon, setShowExpandIcon] = useState(false);

  const [modularType, setModularType] = useState("");
  const [IOType, setIOType] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensorMaxValue, setSensorMaxValue] = useState(50);
  const [sensorMinValue, setSensorMinValue] = useState(10);

  const newDeviceProperties = {
    ID: Date.now(),
    modularType,
    IOType,
    sensorType,
    sensorMaxValue,
  };

  const handleAddProperties = () => {
    if (deviceProperties.length >= 4) return;
    setDeviceProperties([...deviceProperties, newDeviceProperties]);
  };

  useEffect(() => {
    deviceProperties[index] = newDeviceProperties;
    setDeviceProperties(deviceProperties);
  }, [modularType, IOType, sensorType]);

  const handleChangeModularType = (event) => {
    setModularType(event.target.value);
    setExpandModularType(true);
  };

  const handleChangeIOType = (event) => {
    setIOType(event.target.value);
    setExpandIOType(true);
  };

  const handleChangeSensorType = (event) => {
    setSensorType(event.target.value);
  };

  const handleOpenAndCloseExpand = () => {
    if (modularType === null) return;
    setExpandIOType(!expandIOType);
    setExpandModularType(!expandModularType);
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">modular type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modularType}
            label="modular type"
            onChange={handleChangeModularType}
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
          <IconButton
            onClick={handleAddProperties}
            sx={{ color: colors.blue[500] }}
          >
            <AddIcon />
          </IconButton>
          <IconButton onClick={handleDelete} sx={{ color: colors.red[500] }}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      {expandModularType && (
        <Stack spacing={1} direction="row" mt={2} alignItems="center">
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
        <>
          <Stack spacing={1} direction="row" mt={2} alignItems="center">
            {modularType === "Input" ? (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  sensor type
                </InputLabel>
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
            ) : (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  sensor type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sensorType}
                  label="Sensor Type"
                  onChange={handleChangeSensorType}
                >
                  <MenuItem value={"Lamp"}>Lamp</MenuItem>
                  <MenuItem value={"Fan"}>Fan</MenuItem>
                  <MenuItem value={"Buzzer"}>Buzzer</MenuItem>
                  <MenuItem value={"LED"}>LED</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>

          <Stack
            direction="row"
            mb={2}
            mt={2}
            spacing={2}
            pr={5}
            justifyContent="space-between"
          >
            <Stack direction="row" flex={1} alignContent="center" spacing={1}>
              <Typography>Min</Typography>
              <Slider
                defaultValue={10}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => setSensorMinValue(e.target.value)}
              />
              <Typography>{sensorMinValue}</Typography>
            </Stack>

            <Stack direction="row" flex={1} lignContent="center" spacing={1}>
              <Typography>Max</Typography>
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => setSensorMaxValue(e.target.value)}
              />
              <Typography>{sensorMaxValue}</Typography>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default FormNewDevice;
