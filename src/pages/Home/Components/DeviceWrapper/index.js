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

    const layouts = [...layoutList];
    const indexOfAllLayout = layouts.map((layout) => layout.id);
    const indexLayout = indexOfAllLayout.indexOf(newLayoutData.id);

    if (indexLayout === -1) {
      const data = { ...newLayoutData, devices: dropItems };
      const path = `users/${currentUserId}/layouts/`;
      updateDataBase(path, [...layouts, data]);
    } else {
      let layoutTarget = layouts.find(
        (layout) => layout.id === newLayoutData.id
      );

      layoutTarget = { ...newLayoutData, devices: dropItems };
      layouts[indexLayout] = layoutTarget;

      const path = `users/${currentUserId}/layouts/`;
      updateDataBase(path, layouts);
    }
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

        let isMatch = false;
  
        if (item.properties.length === sensorPublic.length) {
          for (let i = 0; sensorPublic.length < i; i++) {
            isMatch =
              item.properties[i].IOType.toUpperCase() ===
                sensorPublic[i].IOType.toUpperCase() &&
              item.properties[i].modularIO.toUpperCase() ===
                sensorPublic[i].modularIO.toUpperCase() &&
              item.properties[i].sensorType.toUpperCase() ===
                sensorPublic[i].sensorType.toUpperCase();
          }
        }

        return (
          <CardDrop
            key={index}
            item={item}
            isError={isMatch}
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
