import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  isAuth: false,
  user: null,
};

export const authStore = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      console.log(action.payload)
      state.user = action.payload;
    },
  },
});

export const authActions = authStore.actions;
