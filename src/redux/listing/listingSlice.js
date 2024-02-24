import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listingData: null,
    loadingListing: false,
    listingError: false,
    listingErrorMsg: "",
  },
  reducers: {
    getListingStart: (state, action) => {
      state.loadingListing = true;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    getListingSuccess: (state, action) => {
      state.loadingListing = false;
      state.listingError = false;
      state.listingErrorMsg = "";

      state.listingData = action.payload;
    },
    getListingFailure: (state, action) => {
      state.loadingListing = false;
      state.listingError = true;
      state.listingErrorMsg = action.payload;
    },

    getSingleListingStart: (state, action) => {
      state.loadingListing = true;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    getSingleListingSuccess: (state, action) => {
      state.loadingListing = false;
      state.listingError = false;
      state.listingErrorMsg = "";

      state.listingData = action.payload;
    },
    getSingleListingFailure: (state, action) => {
      state.loadingListing = false;
      state.listingError = true;
      state.listingErrorMsg = action.payload;
    },

    addListingStart: (state, action) => {
      state.loadingListing = true;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    addListingSuccess: (state, action) => {
      state.loadingListing = false;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    addListingFailure: (state, action) => {
      state.loadingListing = false;
      state.listingError = true;
      state.listingErrorMsg = action.payload;
    },

    updateListingStart: (state, action) => {
      state.loadingListing = true;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    updateListingSuccess: (state, action) => {
      state.loadingListing = false;
      state.listingError = false;
      state.listingErrorMsg = "";

      state.listingData = action.payload;
    },
    updateListingFailure: (state, action) => {
      state.loadingListing = false;
      state.listingError = true;
      state.listingErrorMsg = action.payload;
    },

    deleteListingStart: (state, action) => {
      state.loadingListing = true;
      state.listingError = false;
      state.listingErrorMsg = "";
    },
    deleteListingSuccess: (state, action) => {
      state.loadingListing = false;
      state.listingError = false;
      state.listingErrorMsg = "";

      state.listingData = action.payload;
    },
    deleteListingFailure: (state, action) => {
      state.loadingListing = false;
      state.listingError = true;
      state.listingErrorMsg = action.payload;
    },
  },
});

export const {
  getListingFailure,
  getListingStart,
  getListingSuccess,
  addListingFailure,
  addListingStart,
  addListingSuccess,
  deleteListingFailure,
  deleteListingStart,
  deleteListingSuccess,
  updateListingFailure,
  updateListingStart,
  updateListingSuccess,
  getSingleListingFailure,
  getSingleListingStart,
  getSingleListingSuccess,
} = listingSlice.actions;
export default listingSlice.reducer;
