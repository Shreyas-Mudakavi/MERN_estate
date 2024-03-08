import { createSlice } from "@reduxjs/toolkit";

const searchListingSlice = createSlice({
  name: "searchListing",
  initialState: {
    searchListingData: null,
    loadingSearchListing: false,
    searchListingError: false,
    searchListingErrorMsg: "",
  },
  reducers: {
    searchListingStart: (state, action) => {
      state.loadingSearchListing = true;
      state.searchListingError = false;
      state.searchListingErrorMsg = "";
    },
    searchListingSuccess: (state, action) => {
      state.loadingSearchListing = false;
      state.searchListingError = false;
      state.searchListingErrorMsg = "";

      state.searchListingData = action.payload;
    },
    searchListingFailure: (state, action) => {
      state.loadingSearchListing = false;
      state.searchListingError = true;
      state.searchListingErrorMsg = action.payload;
    },
  },
});

export const {
  searchListingFailure,
  searchListingStart,
  searchListingSuccess,
} = searchListingSlice.actions;
export default searchListingSlice.reducer;
