import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoading: false,
    userError: false,
    userErrMsg: "",
  },
  reducers: {
    getUserStart: (state, action) => {
      state.isLoading = true;
      state.userError = false;
      state.userErrMsg = "";
    },
    getUserSuccess: (state, action) => {
      state.userError = false;
      state.userErrMsg = "";
      state.isLoading = false;

      state.userData = action.payload;
    },
    getUserFailure: (state, action) => {
      state.userErrMsg = action.payload;
      state.isLoading = false;
      state.userError = true;
    },
  },
});

export const { getUserStart, getUserSuccess, getUserFailure } =
  userSlice.actions;
export default userSlice.reducer;
