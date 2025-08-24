import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  isAuth: false,
  onlineUsers: [],
  socket: null,
};

export const authStore = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

export const authActions = authStore.actions;
