import { configureStore } from "@reduxjs/toolkit";

import { gameStore } from "./game";
import { authStore } from "./auth";
import { onlineStore } from "./online";

const store = configureStore({
  reducer: {
    game: gameStore.reducer,
    auth: authStore.reducer,
    online: onlineStore.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["online/setSocket"],
        ignoredPaths: ["online.socket"],
      },
    }),
});

export default store;
