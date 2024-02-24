import { createSlice } from "@reduxjs/toolkit";

const getListingSlice = createSlice({
  name: "getListing",
  initialState: {
    getListingData: null,
    loadingGetListing: false,
    getListingError: false,
    getListingErrorMsg: "",
  },
  reducers: {
    getListingStart: (state, action) => {
      state.loadingGetListing = true;
      state.getListingError = false;
      state.getListingErrorMsg = "";
    },
    getListingSuccess: (state, action) => {
      state.loadingGetListing = false;
      state.getListingError = false;
      state.getListingErrorMsg = "";

      state.getListingData = action.payload;
    },
    getListingFailure: (state, action) => {
      state.loadingGetListing = false;
      state.getListingError = true;
      state.getListingErrorMsg = action.payload;
    },
  },
});

export const { getListingFailure, getListingStart, getListingSuccess } =
  getListingSlice.actions;
export default getListingSlice.reducer;
