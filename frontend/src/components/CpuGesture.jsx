import { useEffect, useRef, useState } from "react";

import { motion } from "motion/react";
import { useDispatch } from "react-redux";

import { GESTURES, /* LOSES */ } from "../constants/gestures";
import Gesture from "../ui/Gesture";
import { gameActions } from "../store/game";

const CpuGesture = ({ move }) => {
  const cpuMoveTimer = useRef();
  const defineWinnerTimer = useRef();

  const [cpuGesture, setCpuGesture] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    //? Just random move
    const cpuMove = GESTURES[Math.floor(Math.random() * 5)];

    //? Always lose
    // const cpuMove = GESTURES.find(
    //   (e) => e.move === LOSES[move][Math.floor(Math.random() * 2)]
    // );

    cpuMoveTimer.current = setTimeout(() => {
      setCpuGesture(cpuMove);
      defineWinnerTimer.current = setTimeout(() => {
        dispatch(gameActions.defineWinner({ move, cpuMove: cpuMove.move }));
      }, 1000);
    }, 1000);

    return () => {
      setCpuGesture(null);
      clearTimeout(cpuMoveTimer.current);
      clearTimeout(defineWinnerTimer.current);
    };
  }, [move, dispatch]);

  return (
    <motion.div layout className="flex flex-col items-center w-60">
      <h2
        className={`
          uppercase text-white text-center text-2xl tracking-widest 
          max-md:order-2 max-md:text-xl max-md:mt-12
        `}
      >
        The House Picked
      </h2>
      {cpuGesture && <Gesture {...cpuGesture} disabled />}
      {!cpuGesture && (
        <motion.div
          className="mt-24 w-21.5 h-23 scale-240 rounded-full bg-black/10 max-md:scale-144"
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 0.25, delay: 0.75 }}
        ></motion.div>
      )}
    </motion.div>
  );
};

export default CpuGesture;
