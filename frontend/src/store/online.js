import { createSlice } from "@reduxjs/toolkit";

// import { WINS } from "../constants/gestures";

const initialState = {
  socket: null,
  rooms: [],
  isInRoom: false,
  hasBegun: false,
  players: [],
  outcome: null,
};
// const initialState = {
//   move: null,
//   winner: null,
//   score: Number(localStorage.getItem("score")) || 0,
// };

export const onlineStore = createSlice({
  name: "online",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      if (state.socket && action.payload === null) {
        state.socket.disconnect();
        state.socket = action.payload;
      } else if (action.payload) {
        state.socket = action.payload;
        state.socket.connect();
      }
    },

    setStateProp: (state, action) => {
      console.log("Payload:", action.payload);
      state[action.payload.prop] = action.payload.data;
    },
  },
  // reducers: {
  //   selectMoveOnline: (state, action) => {
  //     state.move = action.payload;
  //   },
  //   playAgainOnline: (state) => {
  //     state.move = null;
  //     state.winner = null;
  //   },
  //   defineWinnerOnline: (state, action) => {
  //     if (action.payload.move === action.payload.cpuMove) {
  //       state.winner = "Tie";
  //     } else if (WINS[action.payload.move].includes(action.payload.cpuMove)) {
  //       state.score += 1;
  //       state.winner = "Win";
  //     } else {
  //       state.score -= 1;
  //       state.winner = "Lose";
  //     }

  //     localStorage.setItem("score", state.score);
  //   },
  // },
});

export const onlineActions = onlineStore.actions;
