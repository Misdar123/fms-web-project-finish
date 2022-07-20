import { contvertStringToTimestamp } from "./convertStringToTimeStamp";

const generateSensorName = (index) => {
  const sensorName = [
    "Humidity",
    "Temperature",
    "Vibration",
    "Current Consumption",
    "Air Pressure",
  ];
  // const index = Math.floor(Math.random() * 5);
  return sensorName[index];
};

export const generateData = (range, deviceName, indexSensorName) => {
  const sensorName = generateSensorName(4);
  const log = [];
  for (let i = 0; i < range; i++) {
    // const time = contvertStringToTimestamp(`${i + 1} Jul 2022`);
    const createProperties = {
      createdAt: `${i + 1} Jul 2022`,
    };
    createProperties[sensorName] = Math.floor(Math.random() * 101);
    log.push(createProperties);
  }
  return {
    deviceName: deviceName,
    log,
    sensorName: sensorName,
    value: Math.floor(Math.random() * 101),
  };
};

export const generateSensorByName = (range, sensorName) => {
  const result = [];
  for (let i = 0; i < 1; i++) {
    const data = [];
    for (let i = 0; i < range; i++) {
      let timeFormat = (i + 1).toString();
      const createProperties = {
        createdAt: `${timeFormat} Jul 2022`,
      };
      if (i === 20) {
        createProperties["Device 1"] = 2;
      } else {
        createProperties["Device 1"] = Math.floor(Math.random() * 60) + 50;
      }
      createProperties["Device 2"] = Math.floor(Math.random() * 60) + 50;
      createProperties["Device 3"] = Math.floor(Math.random() * 60) + 50;
      data.push(createProperties);
    }
    result.push({ log: data, sensorName: sensorName, deviceName: "" });
  }
  return result;
};
