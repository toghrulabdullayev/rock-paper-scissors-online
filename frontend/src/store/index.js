import { configureStore } from "@reduxjs/toolkit";

import { gameStore } from "./game";
import { authStore } from "./auth";

const store = configureStore({
  reducer: { game: gameStore.reducer, auth: authStore.reducer },
});

export default store;
