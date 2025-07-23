import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";

import { GESTURES } from "../constants/gestures";
import Button from "../ui/Button";
import Gesture from "../ui/Gesture";
import { gameActions } from "../store/game";
import CpuGesture from "./CpuGesture";

const Round = ({ move }) => {
  const winner = useSelector((state) => state.game.winner);
  const dispatch = useDispatch();

  const gesture = GESTURES.find((gesture) => gesture.move === move);

  return (
    <>
      <div className="mt-12 flex justify-evenly items-start h-96 w-full max-w-220 relative">
        <motion.div
          layout
          className="flex flex-col items-center w-60"
        >
          <h2
            className={`
            uppercase text-white text-center text-2xl tracking-widest 
            max-md:order-2 max-md:text-xl max-md:mt-12
          `}
          >
            You Picked
          </h2>
          <Gesture {...gesture} disabled />
        </motion.div>

        {winner && (
          <motion.div
            className="flex flex-col items-center self-center max-md:hidden"
            initial={{ translateY: 10 }}
            animate={{ translateY: 0 }}
          >
            <h1 className="uppercase text-white text-center text-5xl">
              {winner === "Tie" ? "Tie" : "You " + winner}
            </h1>
            <Button
              onClick={() => dispatch(gameActions.playAgain())}
              fill
              className="w-full mt-6"
            >
              Play Again
            </Button>
          </motion.div>
        )}

        <CpuGesture move={move} />
      </div>
      {winner && (
        <motion.div
          className="hidden flex-col items-center self-center max-md:flex"
          initial={{ translateY: -30 }}
          animate={{ translateY: -60 }}
        >
          <h1 className="uppercase text-white text-center text-7xl">
            {winner === "Tie" ? "Tie" : "You " + winner}
          </h1>
          <Button
            onClick={() => dispatch(gameActions.playAgain())}
            fill
            className="w-full mt-6 py-5"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </>
  );
};

export default Round;
