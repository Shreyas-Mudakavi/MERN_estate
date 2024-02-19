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

    // user-update
    userUpdateStart: (state, action) => {
      state.isLoading = true;
      state.userError = false;
      state.userErrMsg = "";
    },
    userUpdateSuccess: (state, action) => {
      state.isLoading = false;
      state.userError = false;
      state.userErrMsg = "";

      state.userData = action.payload;
    },
    userUpdateFailure: (state, action) => {
      state.isLoading = false;
      state.userError = true;
      state.userErrMsg = action.payload;
    },

    // delete-user
    userDeleteStart: (state, action) => {
      state.isLoading = true;
      state.userError = false;
      state.userErrMsg = "";
    },

    userDeleteSuccess: (state, action) => {
      state.isLoading = false;
      state.userErrMsg = "";
      state.userError = false;

      state.userData = null;

      localStorage.clear();
    },

    userDeleteFailure: (state, action) => {
      state.isLoading = false;
      state.userError = true;
      state.userErrMsg = action.payload;
    },
  },
});

export const {
  getUserStart,
  getUserSuccess,
  getUserFailure,
  userUpdateFailure,
  userUpdateStart,
  userUpdateSuccess,
  userDeleteFailure,
  userDeleteStart,
  userDeleteSuccess,
} = userSlice.actions;
export default userSlice.reducer;
