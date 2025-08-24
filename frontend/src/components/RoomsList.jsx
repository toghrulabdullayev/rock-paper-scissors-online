import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Button from "../ui/Button";
import Modal from "./Modal";

export default function RoomsList() {
  const dialogRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const rooms = [
    {
      player1: {
        name: "Aftandile",
        score: 4,
      },
      player2: {
        name: "Crocodile",
        score: 1,
      },
    },
    {
      player1: {
        name: "Aura",
        score: 2,
      },
      player2: {
        name: "Nauru",
        score: 2,
      },
    },
    {
      player1: {
        name: null,
        score: null,
      },
      player2: {
        name: null,
        score: null,
      },
    },
  ];

  const handleIsOpen = () => {
    setTimeout(() => {
      dialogRef.current.showModal();
    }, 0);
    setIsOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <Modal ref={dialogRef} setIsOpen={setIsOpen} />}
      </AnimatePresence>

      <Button className="self-end" onClick={handleIsOpen}>
        Create New Room
      </Button>
      <div className="mt-12 flex flex-row flex-wrap">
        {!rooms.length && "No rooms available"}
        {!!rooms.length &&
          rooms.map((room, index) => (
            <Button className="mr-5 mt-4" key={index}>
              <Link to={`room-${index}`}>
                {room.player1.name || "—"} {room.player1.score} -{" "}
                {room.player2.score} {room.player2.name || "—"}
              </Link>
            </Button>
          ))}
      </div>
    </>
  );
}
