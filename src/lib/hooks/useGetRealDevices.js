import { useSelector } from "react-redux";

export const useGetRealDevices = () => {
  const { allDevice } = useSelector((state) => state.devices);
  const deviceRefRence = (devices) => {
    const result = [];
    devices.forEach((device) => {
      const findDeviceRefrence = allDevice.filter(
        (deviceItem) => deviceItem.macAddress === device.macAddress
      );
      result.push(...findDeviceRefrence);
    });

    return result;
  };

  return [deviceRefRence];
};
