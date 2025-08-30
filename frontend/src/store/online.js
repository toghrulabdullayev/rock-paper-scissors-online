import { createSlice } from "@reduxjs/toolkit";

import { WINS } from "../constants/gestures";

const initialState = {
  socket: null,
  rooms: [],
  isInRoom: false,
  hasBegun: false,
  players: [],
  outcome: null,

  playerMove: null,
  winner: null,
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

    // in-game states
    selectPlayerMove: (state, action) => {
      state.playerMove = action.payload;
    },

    nextRound: (state) => {
      state.playerMove = null;
      state.winner = null;
    },

    defineWinner: (state, action) => {
      if (action.payload.move === action.payload.opponentMove) {
        state.winner = "Tie";
      } else if (
        WINS[action.payload.move].includes(action.payload.opponentMove)
      ) {
        state.winner = "Win";
      } else {
        state.winner = "Lose";
      }
    },

    playAgain: (state) => {
      console.log("play again")
      state.outcome = null;
      state.playerMove = null;
      state.winner = null;
    },
  },
});

export const onlineActions = onlineStore.actions;
