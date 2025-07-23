import { useEffect, useRef, useState } from "react";

import { AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../components/Modal";
import GameBoard from "../components/GameBoard";
import Round from "../components/Round";
import Button from "../ui/Button";
import { gameActions } from "../store/game";

const Cpu = () => {
  const dialogRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const selectedMove = useSelector((state) => state.game.move);
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(gameActions.playAgain());
    },
    [dispatch]
  );

  const handleIsOpen = () => {
    setTimeout(() => {
      dialogRef.current.showModal();
    }, 0);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <AnimatePresence>
          {isOpen && <Modal ref={dialogRef} setIsOpen={setIsOpen} />}
        </AnimatePresence>

        {!selectedMove ? <GameBoard /> : <Round move={selectedMove} />}
      </div>

      <p className="mb-8 text-end max-md:text-center max-md:mt-16">
        <Button onClick={handleIsOpen}>Rules</Button>
      </p>
    </>
  );
};

export default Cpu;
