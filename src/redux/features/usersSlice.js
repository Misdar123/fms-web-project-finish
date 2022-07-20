import { createSlice } from "@reduxjs/toolkit";
import { stringRegex } from "../../lib/function/stringRegex";

const initialState = {
  user: {},
  userId: ""
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    insertUsers: (state, action) => {
      state.user = action.payload
      state.userId = stringRegex(action.payload.email)
    },
  },
});

export const { insertUsers } = usersSlice.actions;

export default usersSlice.reducer;
