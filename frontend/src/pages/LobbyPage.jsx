import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";

import Button from "../ui/Button";
import Modal from "../components/Modal";

const ROUNDS = [1, 3, 5, 7, 9, 11];

// u need tanstack query asap
const LobbyPage = () => {
  const dialogRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [rounds, setRounds] = useState(3);

  const { socket, rooms } = useSelector((state) => state.online);

  const handleIsOpen = () => {
    setTimeout(() => {
      dialogRef.current.showModal();
    }, 0);
    setIsOpen(true);
  };

  const handleCreate = () => {
    socket.emit("joinRoom");
    setIsOpen(false);
  };

  const handleJoinRoom = (room) => {
    socket.emit("joinRoomById", room.roomId);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal ref={dialogRef} setIsOpen={setIsOpen} title="New Room">
            <div className="mt-8 flex justify-evenly gap-2 flex-wrap">
              {ROUNDS.map((round) => (
                <Button
                  key={round}
                  responsive
                  fill={rounds === round}
                  className={`text-dark-text ${
                    rounds === round
                      ? "bg-dark-text text-white border-3 border-dark-text"
                      : ""
                  } w-21 px-0 max-custom:px-0`}
                  onClick={() => setRounds(round)}
                >
                  x{round}
                </Button>
              ))}
            </div>
            <Button
              className="text-dark-text self-end mt-auto"
              onClick={handleCreate}
            >
              Create
            </Button>
          </Modal>
        )}
      </AnimatePresence>

      <Button className="self-end" onClick={handleIsOpen}>
        Create New Room
      </Button>
      <div className="mt-12 flex flex-row flex-wrap">
        {!rooms.length && "No rooms available"}
        {!!rooms.length &&
          rooms.map((room, index) => (
            <Button
              className="mr-5 mt-4"
              key={index}
              onClick={() => handleJoinRoom(room)}
            >
              {room.roomId}
              {/* {room.player1.name || "—"} {room.player1.score} -{" "}
                {room.player2.score} {room.player2.name || "—"} */}
            </Button>
          ))}
      </div>
    </>
  );
};

export default LobbyPage;
