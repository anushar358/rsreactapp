// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
