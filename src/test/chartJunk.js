
// sensor
const sensor = [
    {
      "deviceName": "device 11",
      "log": [
        {
          "createdAt": "1 Jul 2022",
          "humidity": 29
        },
        {
          "createdAt": "2 Jul 2022",
          "humidity": 84
        },
        {
          "createdAt": "3 Jul 2022",
          "humidity": 36
        },
        {
          "createdAt": "4 Jul 2022",
          "humidity": 43
        },
        {
          "createdAt": "5 Jul 2022",
          "humidity": 98
        },
      ],
      "sensorName": "humidity",
      "value": 70
    },
    {
      "deviceName": "device 11",
      "log": [
        {
          "createdAt": "1 Jul 2022",
          "temperature": 21
        },
        {
          "createdAt": "2 Jul 2022",
          "temperature": 90
        },
        {
          "createdAt": "3 Jul 2022",
          "temperature": 74
        },
        {
          "createdAt": "4 Jul 2022",
          "temperature": 53
        },
        {
          "createdAt": "5 Jul 2022",
          "temperature": 76
        },

      ],
      "sensorName": "temperature",
      "value": 25
    },
    {
      "deviceName": "device 2",
      "log": [
        {
          "Humidity": 44,
          "createdAt": "1 Jul 2022"
        },
        {
          "Humidity": 2,
          "createdAt": "2 Jul 2022"
        },
        {
          "Humidity": 56,
          "createdAt": "3 Jul 2022"
        },
        {
          "Humidity": 25,
          "createdAt": "4 Jul 2022"
        },
        {
          "Humidity": 92,
          "createdAt": "5 Jul 2022"
        },
  
      ],
      "sensorName": "Humidity",
      "value": 69
    },
    {
      "deviceName": "device 2",
      "log": [
        {
          "Temperature": 88,
          "createdAt": "1 Jul 2022"
        },
        {
          "Temperature": 54,
          "createdAt": "2 Jul 2022"
        },
        {
          "Temperature": 74,
          "createdAt": "3 Jul 2022"
        },
        {
          "Temperature": 85,
          "createdAt": "4 Jul 2022"
        },
        {
          "Temperature": 85,
          "createdAt": "4 Jul 2022"
        },
    
      ],
      "sensorName": "Temperature",
      "value": 13
    },
    {
      "deviceName": "device 2",
      "log": [
        {
          "Vibration": 50,
          "createdAt": "1 Jul 2022"
        },
        {
          "Vibration": 28,
          "createdAt": "2 Jul 2022"
        },
        {
          "Vibration": 61,
          "createdAt": "3 Jul 2022"
        },
        {
          "Vibration": 87,
          "createdAt": "4 Jul 2022"
        },
        {
          "Vibration": 85,
          "createdAt": "4 Jul 2022"
        },
      ],
      "sensorName": "Vibration",
      "value": 15
    },
    {
      "deviceName": "device 2",
      "log": [
        {
          "Current Consumption": 77,
          "createdAt": "1 Jul 2022"
        },
        {
          "Current Consumption": 37,
          "createdAt": "2 Jul 2022"
        },
        {
          "Current Consumption": 19,
          "createdAt": "3 Jul 2022"
        },
        {
          "Current Consumption": 17,
          "createdAt": "4 Jul 2022"
        },
        {
          "Current Consumption": 73,
          "createdAt": "5 Jul 2022"
        },
       
      ],
      "sensorName": "Current Consumption",
      "value": 97
    },
    {
      "deviceName": "device 2",
      "log": [
        {
          "Air Pressure": 80,
          "createdAt": "1 Jul 2022"
        },
        {
          "Air Pressure": 51,
          "createdAt": "2 Jul 2022"
        },
        {
          "Air Pressure": 73,
          "createdAt": "3 Jul 2022"
        },
        {
          "Air Pressure": 87,
          "createdAt": "4 Jul 2022"
        },
        {
          "Air Pressure": 48,
          "createdAt": "5 Jul 2022"
        },
     
      ],
      "sensorName": "Air Pressure",
      "value": 88
    }
  ]


  const deviceName = sensor.map((data) => data.deviceName)
  const dateCreated = sensor.map((data) => data.log)
  console.log(dateCreated)

  // console.log(deviceName)












// all sensor
const finalData =  [
    {
      "log": [
        {
          "createdAt": "1 Jul 2022",
          "Device 1": 79,
          "Device 2": 82,
          "Device 3": 102
        },
        {
          "createdAt": "2 Jul 2022",
          "Device 1": 64,
          "Device 2": 83,
          "Device 3": 55
        },
        {
          "createdAt": "3 Jul 2022",
          "Device 1": 64,
          "Device 2": 82,
          "Device 3": 92
        },
        {
          "createdAt": "4 Jul 2022",
          "Device 1": 97,
          "Device 2": 62,
          "Device 3": 51
        },
        {
          "createdAt": "5 Jul 2022",
          "Device 1": 68,
          "Device 2": 94,
          "Device 3": 62
        },
      ],
      "sensorName": "Humidity",
      "deviceName": ""
    }
  ]