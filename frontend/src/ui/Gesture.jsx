import { motion } from "motion/react";
import { useDispatch } from "react-redux";

import { gameActions } from "../store/game";

const Gesture = ({ move, img, styles, position, disabled }) => {
  const dispatch = useDispatch();

  return (
    <>
      {!disabled ? (
        <motion.button
          onClick={() => dispatch(gameActions.selectMove(move))}
          className={`
            flex justify-center items-center relative border-b-6 ${styles} ${position} p-2.5 w-17 
            h-16.5 scale-120 rounded-full overflow-hidden box-content cursor-pointer
            max-custom:scale-100
          `}
          initial={{ scale: 0, translateY: 0 }}
          animate={{ scale: 1 }}
          whileHover={{
            scale: 1.03,
            translateY: -3,
            boxShadow: "0 5px 10px 0.1px rgba(10, 10, 10, 0.5)",
          }}
          whileTap={{ scale: 0.97, translateY: 0 }}
        >
          <div className="flex justify-center items-center bg-white w-full h-full border-t-4 border-[#bec0d5] rounded-full">
            <img src={img} className="w-[50%] h-[50%]" />
          </div>
        </motion.button>
      ) : (
        <motion.div
          className={`
            flex justify-center items-center relative border-b-6 ${styles} ${position} p-2.5 w-17 
            h-16.5 scale-250 rounded-full overflow-hidden box-content
            max-md:scale-150 mt-24
          `}
          initial={{ scale: 0, translateY: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-center items-center bg-white w-full h-full border-t-4 border-[#bec0d5] rounded-full">
            <img src={img} className="w-[50%] h-[50%]" />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Gesture;
