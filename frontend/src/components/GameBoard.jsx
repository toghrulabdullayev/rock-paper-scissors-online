import { motion } from "motion/react";

import Gestures from "./Gestures";
import PentagonImg from "/src/assets/images/bg-pentagon.svg";

const GameBoard = () => {
  return (
    <motion.div
      initial={{ scale: 0.7 }}
      animate={{ scale: 1 }}
      className="mt-12 flex justify-center h-96 w-full relative"
    >
      <img
        src={PentagonImg}
        alt="pentagonimg"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 max-custom:w-52 z-[-1]"
      />

      <Gestures />
    </motion.div>
  );
};

export default GameBoard;
