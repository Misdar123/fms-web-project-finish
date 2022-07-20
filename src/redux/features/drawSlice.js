import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapesSelected: null,
};

export const layoutSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    selectedShape: (state, action) => {
      state.shapesSelected = action.payload;
    },
  },
});

export const { selectedShape } = layoutSlice.actions;

export default layoutSlice.reducer;
