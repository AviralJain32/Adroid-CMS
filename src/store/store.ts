import { configureStore } from '@reduxjs/toolkit';
import { ConferenceApiSlice } from './features/ConferenceApiSlice';
import { PaperApiSlice } from './features/PaperApiSlice';
import { ConferenceDashboardPaperSlice } from './features/ConferenceDashboardPaperSlice';
import socketReducer from "@/store/features/videoCalling/SocketSlice"
import { reviewerApiSlice } from './features/ReviewerApiSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [ConferenceApiSlice.reducerPath]: ConferenceApiSlice.reducer,
      [PaperApiSlice.reducerPath]: PaperApiSlice.reducer,
      [ConferenceDashboardPaperSlice.reducerPath]:
        ConferenceDashboardPaperSlice.reducer,
      [reviewerApiSlice.reducerPath]: reviewerApiSlice.reducer,

        //vc reducers
        socket: socketReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        ConferenceApiSlice.middleware,
        PaperApiSlice.middleware,
        ConferenceDashboardPaperSlice.middleware,
        reviewerApiSlice.middleware,
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
