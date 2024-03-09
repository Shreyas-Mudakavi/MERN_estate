import { createSlice } from "@reduxjs/toolkit";

const homeListingsSlice = createSlice({
  name: "homeListings",
  initialState: {
    homeListingsData: null,
    loadingHomeListings: false,
    homeListingsError: false,
    homeListingsErrorMsg: "",
  },
  reducers: {
    homeListingsStart: (state, action) => {
      state.loadingHomeListings = true;
      state.homeListingsError = false;
      state.homeListingsErrorMsg = "";
    },
    homeListingsSuccess: (state, action) => {
      state.loadingHomeListings = false;
      state.homeListingsError = false;
      state.homeListingsErrorMsg = "";

      state.homeListingsData = action.payload;
    },
    homeListingsFailure: (state, action) => {
      state.loadingHomeListings = false;
      state.homeListingsError = true;
      state.homeListingsErrorMsg = action.payload;
    },
  },
});

export const { homeListingsFailure, homeListingsStart, homeListingsSuccess } =
  homeListingsSlice.actions;
export default homeListingsSlice.reducer;
