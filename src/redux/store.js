import { configureStore } from "@reduxjs/toolkit";
import listDevicesInLayout from "./features/undoRedoSlice";
import layoutsReducer from "./features/layoutSlice";
import usersReducer from "./features/usersSlice";
import deviceReducer from "./features/deviceSlice";
import drawerReducer from "./features/drawSlice";

export const store = configureStore({
  reducer: {
    undoRedo: listDevicesInLayout,
    layouts: layoutsReducer,
    user: usersReducer,
    devices: deviceReducer,
    drawer: drawerReducer,
  },
});
