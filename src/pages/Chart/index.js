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
import ButtonExportLayout from "./components/ButtonExportChart";
import EmptyChartAnimation from "./components/EmptyChartAnimation";

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

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const printRef = useRef();

  const getDataFromDataBase = () => {
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

  const handleStartSelectDateTime = (newDateTime) => {
    setStartDateTime(newDateTime);
  };

  const handleEndSelectDateTime = (newDateTime) => {
    setEndDateTime(newDateTime);
  };

  const queryDataByDateTime = () => {
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

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: changeThem ? "#0a1929" : colors.grey[100],
        minHeight: window.innerHeight,
        paddingTop: "1px",
      }}
    >
      {isDeviceExis ? (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              sx={{
                minHeight: "80px",
                backgroundColor: changeThem ? "#001e3c" : "#FFF",
                margin: "20px",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <FormControl sx={{ minWidth: 100 }}>
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

              <FormControl sx={{ minWidth: 100 }}>
                <Select
                  value={selectdeviceProperties}
                  onChange={handleSelectDeviceProperties}
                  sx={{ height: "30px" }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {layoutList[selectLayoutIndex]?.devices.map(
                    (device, index) => (
                      <MenuItem key={index} value={`@device_${device.name}`}>
                        {device.name}
                      </MenuItem>
                    )
                  )}
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
              <Button onClick={queryDataByDateTime} variant="outlined">
                Search
              </Button>
              <ButtonExportLayout componentRef={printRef}>
                Export
              </ButtonExportLayout>
            </Stack>
          </LocalizationProvider>

          {/* <Button onClick={saveData}>Save</Button> */}
          <Grid container spacing={1} p={5} component="div" ref={printRef}>
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
        </>
      ) : (
        <EmptyChartAnimation />
      )}
    </Box>
  );
}
