import { forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { motion } from "motion/react";

import xIcon from "/src/assets/images/icon-close.svg";
import rulesImg from "/src/assets/images/image-rules-bonus.svg";

const Modal = ({ setIsOpen }, ref) => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    });
  }, [setIsOpen]);

  return createPortal(
    <motion.dialog
      ref={ref}
      className="backdrop:bg-black backdrop:opacity-50 left-[50%] -ml-40 -mt-48 bg-transparent outline-none max-custom:-ml-30 max-custom:-mt-36"
      onClick={() => setIsOpen(false)}
      initial={{ opacity: 0, top: 0 }}
      animate={{ opacity: 1, top: "50%" }}
      transition={{ duration: 0.3, ease: "backInOut" }}
      exit={{ opacity: 0, top: 0 }}
    >
      <div
        className="flex flex-col items-center bg-white w-80 h-96 border rounded-xl p-6 border-none max-custom:w-60 max-custom:h-72"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full">
          <h1 className="uppercase font-bold text-dark-text text-3xl max-custom:text-2xl">
            Rules
          </h1>
          <img
            onClick={() => setIsOpen(false)}
            src={xIcon}
            alt="x-icon"
            className="cursor-pointer w-5 max-custom:w-4"
          />
        </div>
        <img src={rulesImg} alt="rules-img" className="mt-4" />
      </div>
    </motion.dialog>,
    document.getElementById("modal")
  );
};

export default forwardRef(Modal);
