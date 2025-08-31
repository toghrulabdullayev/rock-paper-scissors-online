import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "motion/react";

import Button from "../ui/Button";
import Modal from "../components/Modal";
import OnlineGame from "../components/OnlineGame";

const ROUNDS = [1, 3, 5, 7, 9, 11];

// u need tanstack query asap
const LobbyPage = () => {
  const dialogRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [rounds, setRounds] = useState(3);
  // const navigate = useNavigate();

  const { socket, rooms, isInRoom, hasBegun } = useSelector(
    (state) => state.online
  );

  const handleIsOpen = () => {
    setTimeout(() => {
      dialogRef.current.showModal();
    }, 0);
    setIsOpen(true);
  };

  const handleCreate = () => {
    socket.emit("joinRoom", rounds);
    setIsOpen(false);
  };

  const handleJoinRoom = (room) => {
    socket.emit("joinRoomById", room.roomId);
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom");
  };

  return !isInRoom ? (
    <div className="mt-16 flex flex-col justify-between items-center h-fit">
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
      <div className="mt-12 flex flex-row flex-wrap text-gray-text">
        {!rooms.length && <p className="text-xl">No rooms available</p>}
        {!!rooms.length &&
          rooms.map((room, index) => (
            <Button
              className="mr-5 mt-4"
              key={index}
              onClick={() => handleJoinRoom(room)}
            >
              {/* {room.roomId} */}
              {room.users[1]?.username || "........"} {room.users[1]?.score} -{" "}
                {room.users[0]?.score} {room.users[0]?.username || "........"}
            </Button>
          ))}
      </div>
    </div>
  ) : !hasBegun ? (
    <div className="mt-16 flex flex-col justify-between items-center h-fit">
      <h1 className="text-gray-text text-xl">
        Waiting for another player to join...
      </h1>
      <Button className="mt-8" onClick={handleLeaveRoom}>
        Leave
      </Button>
    </div>
  ) : (
    <OnlineGame />
  );
};

export default LobbyPage;
