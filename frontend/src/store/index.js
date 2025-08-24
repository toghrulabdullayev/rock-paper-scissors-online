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
});

export default store;
