import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Logo from "/src/assets/images/logo-bonus.svg";
import CountAnimation from "../ui/CountAnimation";
import AuthNavlinks from "./AuthNavlinks";
import DropDown from "../ui/Dropdown";

const Header = ({ inGame, inOnlineGame }) => {
  const { players } = useSelector((state) => state.online);
  const { isAuth } = useSelector((state) => state.auth);

  console.log("Players:", players);

  return (
    <header
      className={`mt-8 flex justify-between items-center h-fit w-[90vw] px-5 py-3 border-3 rounded-xl border-header-outline max-custom:py-2 max-custom:px-3 ${
        inGame ? "max-w-[720px]" : ""
      }`}
    >
      {!inOnlineGame ? (
        <>
          <Link to="/" className="mt-1">
            <img src={Logo} alt="logo" className="max-custom:w-18" />
          </Link>
          {inGame ? (
            <div className="bg-white px-10 py-2 rounded-lg max-custom:px-5">
              <h1 className="uppercase text-score-text tracking-widest text-center max-custom:text-xs">
                Score
              </h1>
              <CountAnimation />
            </div>
          ) : (
            <div className="flex gap-5">
              {isAuth ? <DropDown /> : <AuthNavlinks />}
            </div>
          )}
        </>
      ) : (
        <>
          {players &&
            players.map((player) => (
              <div
                key={player.username}
                className="bg-white px-10 py-2 rounded-lg max-custom:px-5"
              >
                <h1 className="uppercase text-score-text tracking-widest text-center max-custom:text-xs">
                  {player.username}
                </h1>
                <CountAnimation playerScore={player.score} />
              </div>
            ))}
        </>
      )}
    </header>
  );
};

export default Header;
