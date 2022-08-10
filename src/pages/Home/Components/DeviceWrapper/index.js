import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import CardDrop from "../cardDrop";
import { useContextApi } from "../../../../lib/hooks/useContexApi";
import {
  readDataBase,
  updateDataBase,
} from "../../../../lib/function/dataBaseCRUD";
import { useDispatch, useSelector } from "react-redux";
import { addDeviceDelete } from "../../../../redux/features/deviceSlice";
import { useGetRealDevices } from "../../../../lib/hooks/useGetRealDevices";

const DeviceWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { setIsDisplayAlert, currentUserId } = useContextApi();

  const [dropItems, setDropItems] = useState([]);
  const [selectIndexDropItem, setSelectIndexDropItem] = useState(null);
  const { layoutList, layoutIndexSelected } = useSelector(
    (state) => state.layouts
  );

  const newLayoutData = layoutList[layoutIndexSelected];
  const { publicDevice, allDevice } = useSelector((state) => state.devices);
  const dragItems = allDevice;

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "card",
    drop: (item) => addItemToDropList(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToDropList = (id) => {
    const result = dragItems.filter((item) => id === item.id);
    if (result[0]?.macAddress === undefined) {
      document.location.reload();
    }
    const getAllMacAdress =
      JSON.parse(localStorage.getItem("allMacAddress")) || [];
    const isDeviceAlreadyExis = getAllMacAdress.includes(result[0].macAddress);

    if (!isDeviceAlreadyExis) {
      setDropItems((item) => [...item, result[0]]);
    } else {
      setIsDisplayAlert({
        isError: true,
        message: "device sudah digunakan",
        type: "error",
      });
      setTimeout(
        () => setIsDisplayAlert({ isError: false, message: "", type: "error" }),
        2000
      );
    }
  };

  // save drop items in layouts to data base
  useEffect(() => {
    const dropItemsId = dropItems.map((item) => item.macAddress);
    const getAllMacAdress =
      JSON.parse(localStorage.getItem("allMacAddress")) || [];
    const isDeviceAlreadyExis = getAllMacAdress.includes(
      ...dropItemsId.slice(-1)
    );
    if (isDeviceAlreadyExis) return;

    if (dropItems.length === 0) return;

    const dataToSave = dragItems.map((data) => {
      return { macAddress: data.macAddress, id: data.id };
    });

    const path = `users/${currentUserId}/layouts/${layoutIndexSelected}`;
    updateDataBase(path, { ...newLayoutData, devices: dataToSave });
  }, [dropItems]);

  // find refrence drop item device in all device list

  const [deviceRefRence] = useGetRealDevices();

  useEffect(() => {
    setDropItems([]);
    if (Array.isArray(newLayoutData?.devices)) {
      const getDeviceFromDataBase = [];
      deviceRefRence(newLayoutData.devices).forEach((item) => {
        const path = `devices/${item.macAddress}`;
        readDataBase(path, (data) => {
          getDeviceFromDataBase.push({
            ...data,
            ...item,
          });
        });
      });
      setDropItems(getDeviceFromDataBase);
    } else {
      setDropItems([]);
    }
    setSelectIndexDropItem(null);
  }, [layoutIndexSelected, layoutList, publicDevice]);

  const handleAddDeleteItemInRedux = (index) => {
    setSelectIndexDropItem(index);
    dispatch(
      addDeviceDelete({ layoutId: newLayoutData.id, device: dropItems[index] })
    );
  };

  // for drop down menu
  const handleOnDoubleClick = () => {
    setSelectIndexDropItem(null);
    dispatch(addDeviceDelete(null));
  };

  return (
    <div ref={dropRef} style={{ position: "relative" }}>
      {children}

      {dropItems.map((item, index) => {
        const publicDeviceRef = publicDevice[item.macAddress];

        if (!Array.isArray(publicDeviceRef.sensor)) return;

        const PublicSensors = publicDeviceRef.sensor.map((data) => data);

        let isMatch = true;
        let errorMessage = "";
        let isWarning = false;
        let isSensorActive = true;

        for (let i = 0; PublicSensors.length > i; i++) {
          if (PublicSensors[i].value >= item.properties[i].sensorLimit) {
            isWarning = true;
            const port = PublicSensors[i].properties.port;
            errorMessage = { message: "over limit", port };
          }

          if (!PublicSensors[i].isActive) {
            isSensorActive = false;
            const sensorName = PublicSensors[i].sensorName;
            const port = PublicSensors[i].properties.port;
            const message = `${sensorName} (Port ${port}) is not detected, please check your device (${item.deviceName})`;
            errorMessage = { port, message };
          }

          if (isMatch) {
            const modularType =
              item.properties[i].modularType.toUpperCase() ===
              PublicSensors[i].properties.modularType.toUpperCase();

            if (!modularType) {
              const port = PublicSensors[i].properties.port;
              const message = "modularType not match at position " + port;
              errorMessage = { port, message };
            }

            const IOType =
              item.properties[i].IOType.toUpperCase() ===
              PublicSensors[i].properties.IOType.toUpperCase();
            if (!IOType) {
              const port = PublicSensors[i].properties.port;
              const message = "IOType not match at position " + port;
              errorMessage = { port, message };
            }

            const sensorType =
              item.properties[i].sensorType.toUpperCase() ===
              PublicSensors[i].properties.sensorType.toUpperCase();

            if (!sensorType) {
              const port = PublicSensors[i].properties.port;
              const message = "sensorType not match at position " + port;
              errorMessage = { port, message };
            }

            isMatch = IOType && modularType && sensorType;
          }
        }

        return (
          <CardDrop
            key={index}
            errorMessage={errorMessage}
            item={item}
            isError={!isMatch || !isSensorActive}
            isWarning={isWarning}
            onClick={() => handleAddDeleteItemInRedux(index)}
            isActive={selectIndexDropItem === index}
            onDoubleClick={handleOnDoubleClick}
          />
        );
      })}
    </div>
  );
};

export default DeviceWrapper;
