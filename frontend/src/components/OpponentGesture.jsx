import { useEffect, useRef, useState } from "react";

import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";

import { onlineActions } from "../store/online";
import { GESTURES /* LOSES */ } from "../constants/gestures";
import Gesture from "../ui/Gesture";

const OpponentGesture = ({ move }) => {
  const opponentMoveTimer = useRef();
  const defineWinnerTimer = useRef();
  const { players } = useSelector((state) => state.online);
  const [opponentGesture, setOpponentGesture] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Player gesture", move);
    console.log("Opponent gesture", players[1].gesture);
    const opponentMove = players[1].gesture;

    //? Always lose
    // const opponentMove = GESTURES.find(
    //   (e) => e.move === LOSES[move][Math.floor(Math.random() * 2)]
    // );

    if (opponentMove) {
      opponentMoveTimer.current = setTimeout(() => {
        setOpponentGesture(opponentMove);
        defineWinnerTimer.current = setTimeout(() => {
          dispatch(onlineActions.defineWinner({ move, opponentMove }));
        }, 1000);
      }, 1000);
    }

    return () => {
      clearTimeout(opponentMoveTimer.current);
      clearTimeout(defineWinnerTimer.current);
    };
  }, [move, dispatch, players]);

  return (
    <motion.div layout className="flex flex-col items-center w-60">
      <h2
        className={`
          uppercase text-white text-center text-2xl tracking-widest 
          max-md:order-2 max-md:text-xl max-md:mt-12
        `}
      >
        Opponent Picked
      </h2>
      {opponentGesture && (
        <Gesture
          {...GESTURES.find((GESTURE) => GESTURE.move === opponentGesture)}
          disabled
        />
      )}
      {!opponentGesture && (
        <motion.div
          className="mt-24 w-21.5 h-23 scale-240 rounded-full bg-black/10 max-md:scale-144"
          initial={{ scale: 1 }}
          animate={players[1].gesture ? { scale: 0 } : { scale: 1 }}
          transition={{ duration: 0.25, delay: 0.75 }}
        ></motion.div>
      )}
    </motion.div>
  );
};

export default OpponentGesture;
