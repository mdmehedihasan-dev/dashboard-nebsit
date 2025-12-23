import { configureStore } from "@reduxjs/toolkit";
import { noticesApi } from "../features/api/noticesApi";

export const store = configureStore({
  reducer: {
    [noticesApi.reducerPath]: noticesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(noticesApi.middleware),
});
