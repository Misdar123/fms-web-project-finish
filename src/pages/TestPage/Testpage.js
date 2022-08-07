import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { readDataBase, writeDataBase } from "../../lib/function/dataBaseCRUD";

const TestPage = () => {
  const [count, setCount] = useState(0);
  const [startSimulation, setStartSimulation] = useState(false);
  const [deviceSensors, setDeviceSensors] = useState([]);

  const handleStartSimulation = () => {
    setStartSimulation(!startSimulation);
  };

  const generateData = (sensorName) => {
    const time = new Date();
    const properties = {
      createdAt: time.toDateString(),
      [sensorName]: Math.floor(Math.random() * 81) + 20,
    };
    return properties;
  };

  const readData = () => {
    const path = `devices/B4:E6:2D:1B:88:C1/sensor`;
    readDataBase(path, (data) => {
      setDeviceSensors(data);
    });
  };

  useEffect(() => {
    readData();
  }, []);

  useEffect(() => {
    if (startSimulation) return;

    const interval = setInterval(() => {
      setCount(count + 1);
      const sensorName = ["humidity", "temperature"];
      deviceSensors.forEach((value, index) => {
        if (Array.isArray(value.log)) {
          value.log.push(generateData(sensorName[index]));
        } else {
          value.log = [generateData(sensorName[index])];
        }
      });
      const path = `devices/B4:E6:2D:1B:88:C1/sensor`;
      writeDataBase(path, deviceSensors);
    }, 5000);

    return () => clearInterval(interval);
  });

  console.log(deviceSensors);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Generate Data</h1>
      <p>{count} row</p>
      <Button variant="outlined" onClick={handleStartSimulation}>
        {startSimulation ? "Start" : "Stop"}
      </Button>
    </div>
  );
};

export default TestPage;
