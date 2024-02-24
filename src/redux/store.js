import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/authSlice";
import getUserReducer from "./user/userSlice";
import listingReducer from "./listing/listingSlice";
import getListingReducer from "./listing/getListingSlice";

const persistConfig = {
  key: "auth",
  storage,
  version: 1,
};

const userPersistConfig = {
  key: "user",
  storage,
  version: 1,
};
const rootReducer = combineReducers({
  auth: authReducer,
  user: persistReducer(userPersistConfig, getUserReducer),
  // listing: listingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
    listing: listingReducer,
    getListing: getListingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
