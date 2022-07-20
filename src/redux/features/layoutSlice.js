import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layoutList: [],
  layoutIndexSelected: 0,
};

export const layoutSlice = createSlice({
  name: "layouts",
  initialState,
  reducers: {
    addLayout: (state, action) => {
      state.layoutList.push(...action.payload);
    },
    insertLayout: (state, action) => {
      state.layoutList.splice(0, state.layoutList.length);
      state.layoutList.push(...action.payload);
    },
    setIndexLayout: (state, action) => {
      state.layoutIndexSelected = action.payload;
    },
  },
});

export const { addLayout, insertLayout, setIndexLayout } = layoutSlice.actions;

export default layoutSlice.reducer;
