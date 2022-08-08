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

    const dataToSave = dragItems.map((data) => data.macAddress);

    const path = `users/${currentUserId}/layouts/${layoutIndexSelected}`;
    updateDataBase(path, { ...newLayoutData, devices: dropItems });
  }, [dropItems]);

  // find refrence drop item device in all device list
  useEffect(() => {
    setDropItems([]);
    if (Array.isArray(newLayoutData?.devices)) {
      const deviceRefrence = [];
      newLayoutData.devices.forEach((device) => {
        const findDeviceRefrence = allDevice.filter(
          (deviceItem) => deviceItem.macAddress === device.macAddress
        );
        deviceRefrence.push(...findDeviceRefrence);
      });

      const getDeviceFromDataBase = [];
      deviceRefrence.forEach((item) => {
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

        const sensorPublic = publicDeviceRef.sensor.map(
          (data) => data.properties
        );

        let isMatch = true;
        let errorMessage = "";

        for (let i = 0; sensorPublic.length > i; i++) {
          if (isMatch) {
            const modularType =
              item.properties[i].modularType.toUpperCase() ===
              sensorPublic[i].modularType.toUpperCase();

            if (!modularType) {
              errorMessage = "modularType not match at position " + (i + 1);
            }

            const IOType =
              item.properties[i].IOType.toUpperCase() ===
              sensorPublic[i].IOType.toUpperCase();
            if (!IOType) {
              errorMessage = "IOType not match at position " + (i + 1);
            }

            const sensorType =
              item.properties[i].sensorType.toUpperCase() ===
              sensorPublic[i].sensorType.toUpperCase();

            if (!sensorType) {
              errorMessage = "sensorType not match at position " + (i + 1);
            }

            isMatch = IOType && modularType && sensorType;

            // console.log(`${index} : ${IOType} ${modularType} ${sensorType}`)
          }
        }

        return (
          <CardDrop
            key={index}
            errorMessage={errorMessage}
            item={item}
            isError={!isMatch}
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
