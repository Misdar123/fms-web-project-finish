import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  undo: [],
  redo: [],
  deviceInLayout: [],
};

export const listDevicesInLayout = createSlice({
  name: "undoRedo",
  initialState,
  reducers: {
    insertListDeviceInLayout: (state, action) => {
      state.deviceInLayout.push(action.payload);
    },
    removeListDeviceInLayout: (state, action) => {
      const newDevices = state.deviceInLayout.filter(
        (device) => device.id !== action.payload.id
      );
      state.deviceInLayout = newDevices;
    },
    replaceListDeviceInLayout: (state, action) => {
      state.deviceInLayout.splice(0, state.deviceInLayout.length)
      state.deviceInLayout.push(...action.payload);
    },
  },
});

export const {
  insertListDeviceInLayout,
  removeListDeviceInLayout,
  replaceListDeviceInLayout
} = listDevicesInLayout.actions;

export default listDevicesInLayout.reducer;
