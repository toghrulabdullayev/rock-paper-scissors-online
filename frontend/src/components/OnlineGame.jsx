import { useRef, useState } from "react";

import { AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";

import Modal from "../components/Modal";
import GameBoard from "../components/GameBoard";
import OnlineRound from "./OnlineRound";
import Button from "../ui/Button";
import rulesImg from "/src/assets/images/image-rules-bonus.svg";

const OnlineGame = () => {
  const dialogRef = useRef(); // for Modal
  const [isOpen, setIsOpen] = useState(false); // for Modal
  const selectedMove = useSelector((state) => state.online.playerMove);

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
          {isOpen && (
            <Modal ref={dialogRef} title="Rules" setIsOpen={setIsOpen}>
              <img src={rulesImg} alt="rules-img" className="mt-4" />
            </Modal>
          )}
        </AnimatePresence>

        {!selectedMove ? <GameBoard /> : <OnlineRound move={selectedMove} />}
      </div>

      <p className="mb-8 text-end max-md:text-center max-md:mt-16">
        <Button onClick={handleIsOpen}>Rules</Button>
      </p>
    </>
  );
};

export default OnlineGame;
