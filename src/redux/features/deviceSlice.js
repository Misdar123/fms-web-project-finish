import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDevice: [],
  publicDevice: {},
  groupDevice: [],
  deviceInLayout: [],
  deviceDelete: null,
  dropDevices: [],
};

export const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    insertAllDevice: (state, action) => {
      state.allDevice.splice(0, state.allDevice.length);
      state.allDevice.push(...action.payload);
    },
    insertPublicDevice: (state, action) => {
      state.publicDevice = action.payload;
    },
    insertGroupDevice: (state, action) => {
      state.groupDevice.splice(0, state.groupDevice.length);
      state.groupDevice.push(...action.payload);
    },
    insertDeviceInLayout: (state, action) => {
      state.deviceInLayout.splice(0, state.deviceInLayout.length);
      state.deviceInLayout.push(...action.payload);
    },
    addDeviceInLayout: (state, action) => {
      state.deviceInLayout.push(action.payload);
    },
    addDeviceDelete: (state, action) => {
      state.deviceDelete = action.payload;
    },
    insertDropDevices: (state, action) => {
      state.dropDevices.splice(0, state.deviceInLayout.length);
      state.dropDevices.push(...action.payload);
    },
    addDropDevices: (state, action) => {
      state.dropDevices.push(action.payload);
    },
  },
});

export const {
  insertAllDevice,
  insertPublicDevice,
  insertGroupDevice,
  insertDeviceInLayout,
  addDeviceInLayout,
  addDeviceDelete,
  insertDropDevices,
  addDropDevices,
} = deviceSlice.actions;

export default deviceSlice.reducer;
