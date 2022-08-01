import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import CardDrop from "../cardDrop";
import { useContextApi } from "../../../../lib/hooks/useContexApi";
import { updateDataBase } from "../../../../lib/function/dataBaseCRUD";
import { useDispatch, useSelector } from "react-redux";
import {
  addDeviceDelete,
  addDeviceInLayout,
} from "../../../../redux/features/deviceSlice";

const DeviceWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { setIsDisplayAlert, currentUserId, allDeviceExisInLayout } =
    useContextApi();

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
    setDropItems((item) => [...item, result[0]]);
  };

  // // check duplicate dropItems
  useEffect(() => {
    const dropItemsId = dropItems.map((item) => item.macAddress);
    const dropItemUniqueId = [...new Set(dropItemsId)];

    if (dropItemUniqueId.length !== dropItems.length) {
      setIsDisplayAlert({
        isError: true,
        message: "device sudah digunakan",
        type: "error",
      });
      setTimeout(
        () => setIsDisplayAlert({ isError: false, message: "", type: "error" }),
        2000
      );
      dropItems.pop();
    } else {
      dispatch(addDeviceInLayout(dropItems[dropItems.length - 1]));
    }
  }, [dropItems]);

  // save drop items in layouts to data base
  useEffect(() => {
    const layouts = [...layoutList];

    const dropItemsId = dropItems.map((item) => item.macAddress);
    const allMacAddress = allDeviceExisInLayout.map((item) => item.macAddress);
    const isDeviceAlreadyExis = allMacAddress.includes(...dropItemsId.slice(-1));
    if (isDeviceAlreadyExis) {
      return;
    }

    if (dropItems.length === 0) return;

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

  // find refrence drop item device in all device collections
  const refrenceDevice = () => {
    if (Array.isArray(newLayoutData?.devices)) {
      const deviceRefrence = [];

      newLayoutData.devices.forEach((device) => {
        const findDeviceRefrence = allDevice.filter(
          (deviceItem) => deviceItem.macAddress === device.macAddress
        );
        deviceRefrence.push(...findDeviceRefrence);
      });

      setDropItems(deviceRefrence);
    } else {
      setDropItems([]);
    }
  };

  useEffect(() => {
    refrenceDevice();
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
      {dropItems !== undefined &&
        dropItems.map((item, index) => {
          return (
            <CardDrop
              key={index}
              item={item}
              layoutId={newLayoutData.id}
              onClick={() => handleAddDeleteItemInRedux(index)}
              isActive={selectIndexDropItem === index}
              onDoubleClick={handleOnDoubleClick}
              isDraging={isOver}
            />
          );
        })}
    </div>
  );
};

export default DeviceWrapper;
