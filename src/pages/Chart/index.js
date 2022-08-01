import { Button, colors, Grid, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useSelector } from "react-redux";

import CardChart from "./components/CardChart";
import {
  generateData,
  generateSensorByName,
} from "./lib/functions/generateData";
import { readDataBase, writeDataBase } from "./lib/functions/dataBaseCRUD";
import { contvertStringToTimestamp } from "./lib/functions/convertStringToTimeStamp";
import { useContextApi } from "../../lib/hooks/useContexApi";
import EmptyChartAnimation from "./components/EmptyChartAnimation";

import Menu from "@mui/material/Menu";

export default function Chart() {
  const [selectLayoutIndex, setSelectLayoutIndex] = useState(0);
  const { changeThem } = useContextApi();

  const [chartData, setChartData] = useState([]);
  const [allChartData, setAllChartData] = useState([]);
  const [allSensorName, setAllSensorName] = useState([]);

  const [selectdeviceProperties, setSelectDeviceProperties] = useState("");
  const [showAllSensors, setShowAllSensors] = useState(true);

  const { layoutList } = useSelector((state) => state.layouts);
  const isDeviceExis = layoutList[selectLayoutIndex]?.devices;

  const { user } = useSelector((state) => state.user);

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const printRef = useRef();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenuExport = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenuExport = () => {
    setAnchorEl(null);
  };

  const getDataFromDataBase = () => {
    if (!isDeviceExis) return;
    if (!layoutList[selectLayoutIndex]?.devices) return;
    const deviceRefrenceToDataBase = layoutList[selectLayoutIndex]?.devices.map(
      (data) => {
        return { macAddress: data.macAddress, name: data.name };
      }
    );
    readDataBase("devices/", (data) => {
      const chartData = [];
      deviceRefrenceToDataBase.forEach((value) => {
        const sensorsFilter = data[value.macAddress].sensor;
        sensorsFilter.forEach((sen) => {
          sen.deviceName = value.name;
        });
        chartData.push(...sensorsFilter);
        setAllSensorName(sensorsFilter.map((sensor) => sensor.sensorName));
      });
      setAllChartData(chartData);
      setChartData(chartData);
    });
  };

  // console.log(chartData)

  const handleStartSelectDateTime = (newDateTime) => {
    setStartDateTime(newDateTime);
  };

  const handleEndSelectDateTime = (newDateTime) => {
    setEndDateTime(newDateTime);
  };

  const queryDataByDateTime = () => {
    if (!isDeviceExis) return;

    const newData = [...allChartData];
    const timeStart = contvertStringToTimestamp(startDateTime);
    const timeEnd = contvertStringToTimestamp(endDateTime);
    if (timeStart >= timeEnd) {
      alert("data not found");
      return;
    }
    getDataFromDataBase();
    newData.forEach((value) => {
      const filterData = value.log.filter((data) => {
        const start = timeStart <= contvertStringToTimestamp(data.createdAt);
        const end = contvertStringToTimestamp(data.createdAt) <= timeEnd;
        return start && end;
      });
      if (filterData.length !== 0) {
        value.log = filterData;
      }
    });
    setChartData(allChartData);
  };

  const handleSelectLayout = (event) => {
    setSelectLayoutIndex(event.target.value);
    setShowAllSensors(true);
  };

  const handleSelectDeviceProperties = (event) => {
    if (event.target.value.slice(0, 7) === "@device") {
      const newChartData = allChartData.filter(
        (data) => data.deviceName === event.target.value.slice(8)
      );
      setShowAllSensors(true);
      setChartData(newChartData);
    } else {
      setShowAllSensors(false);
      setChartData(generateSensorByName(30, event.target.value.slice(8)));
    }
    setSelectDeviceProperties(event.target.value);
  };

  useEffect(() => {
    setStartDateTime(new Date("2022-07-01T24:00:00"));
    setEndDateTime(new Date("2022-07-30T24:00:00"));
  }, [selectLayoutIndex, selectdeviceProperties]);

  useEffect(() => {
    getDataFromDataBase();
  }, [selectLayoutIndex]);

  const saveData = () => {
    writeDataBase("/devices/BC:DD:C2:23:F0:F1/sensor/4", {
      ...generateData(30, "Device 2"),
    });
  };

  const downloadData = (type) => {
    if (!isDeviceExis) return;

    const titles = allChartData.map((item) => item.sensorName);
    const data = allChartData.map((item) => item.log);
    let listData = [];

    for (let i = 0; i < titles.length; i++) {
      const sensorValue = [];
      for (let j = 0; j < data[0].length; j++) {
        sensorValue.push(data[i][j][titles[i]]);
      }
      listData.push(sensorValue);
    }

    // transform matrix of array
    const transform = [];
    for (let i = 0; i < listData[0].length; i++) {
      const row = [];
      for (let j = 0; j < listData.length; j++) {
        row.push(listData[j][i]);
      }
      transform.push(row);
    }

    listData = transform;
    listData.unshift(titles);

    const element = document.createElement("a");

    const file = new Blob([...listData.join("\n")], {
      type: type,
    });
    element.href = URL.createObjectURL(file);
    let fileExtention = "";

    const dateTime = new Date();
    const fileName = `${
      user?.userName
    }_${dateTime.toDateString()}_${dateTime.getHours()}_${dateTime.getMinutes()}_${dateTime.getSeconds()}`;
    switch (type) {
      case "txt":
        fileExtention = `${fileName}.txt`;
        break;
      case "csv":
        fileExtention = `${fileName}.csv`;
        break;
      default:
        fileExtention = `${fileName}.xlsx`;
        break;
    }
    element.download = fileExtention;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: changeThem ? "#0a1929" : colors.grey[100],
        minHeight: window.innerHeight,
        paddingTop: "1px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
          sx={{
            minHeight: "80px",
            backgroundColor: changeThem ? "#001e3c" : "#FFF",
            margin: "20px",
            alignItems: "center",
            padding: { xs: "5px", sm: "10px" },
          }}
        >
          <FormControl sx={{ minWidth: { xs: 240, sm: 100 } }}>
            <Select
              value={selectLayoutIndex}
              onChange={handleSelectLayout}
              sx={{ height: "30px" }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {layoutList.map((layout, index) => (
                <MenuItem key={index} value={index}>
                  {layout.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: 240, sm: 100 } }}>
            <Select
              value={selectdeviceProperties}
              onChange={handleSelectDeviceProperties}
              sx={{ height: "30px" }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {isDeviceExis &&
                layoutList[selectLayoutIndex]?.devices.map((device, index) => (
                  <MenuItem key={index} value={`@device_${device.name}`}>
                    {device.name}
                  </MenuItem>
                ))}
              {allSensorName.map((data, index) => (
                <MenuItem key={index} value={`@sensor_${data}`}>
                  All {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DateTimePicker
            label="Start"
            value={startDateTime}
            onChange={handleStartSelectDateTime}
            renderInput={(params) => <TextField {...params} displayEmpty />}
          />
          <DateTimePicker
            label="End"
            value={endDateTime}
            onChange={handleEndSelectDateTime}
            renderInput={(params) => <TextField {...params} displayEmpty />}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button onClick={queryDataByDateTime} variant="outlined">
              Search
            </Button>
            <Button onClick={handleOpenMenuExport} variant="outlined">
              Export
            </Button>
          </Stack>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenuExport}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                downloadData("csv");
                handleCloseMenuExport();
              }}
            >
              export as csv
            </MenuItem>
            <MenuItem
              onClick={() => {
                downloadData("txt");
                handleCloseMenuExport();
              }}
            >
              export as txt
            </MenuItem>
            <MenuItem
              onClick={() => {
                downloadData(
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                handleCloseMenuExport();
              }}
            >
              export as xlsx
            </MenuItem>
          </Menu>
        </Stack>
      </LocalizationProvider>
      {isDeviceExis ? (
        <Grid
          container
          spacing={1}
          p={{ xs: 1, sm: 5 }}
          component="div"
          ref={printRef}
        >
          {isDeviceExis &&
            chartData.map((value, index) => {
              return showAllSensors ? (
                <Grid item xs={12} md={6} key={index}>
                  <CardChart
                    data={value.log}
                    title={value.deviceName}
                    sensorName={value.sensorName}
                    isShowAllSensors={showAllSensors}
                  />
                </Grid>
              ) : (
                <Grid item sm={12} md={12} key={index}>
                  <CardChart
                    data={value.log}
                    title={value.deviceName}
                    sensorName={value.sensorName}
                    isShowAllSensors={showAllSensors}
                  />
                </Grid>
              );
            })}
        </Grid>
      ) : (
        <EmptyChartAnimation />
      )}
    </Box>
  );
}
