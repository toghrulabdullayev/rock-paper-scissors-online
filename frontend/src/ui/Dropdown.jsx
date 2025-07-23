import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import LogoutButton from "../components/LogoutButton";

const Dropdown = () => {
  const [isShown, setIsShown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsShown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <div
        ref={dropdownRef}
        className="size-18 max-custom:size-14"
        onClick={() => setIsShown((prevIsShown) => !prevIsShown)}
      >
        <button
          id="menu-button"
          type="button"
          aria-expanded="true"
          aria-haspopup="true"
          className="flex w-full h-full justify-center gap-x-1.5 rounded-full bg-white text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        >
          Profile
        </button>
      </div>

      <div
        role="menu"
        tabIndex="-1"
        aria-labelledby="menu-button"
        aria-orientation="vertical"
        className={`${
          !isShown ? "hidden" : undefined
        } absolute -right-5.75 max-custom:-right-3.75 z-10 mt-11.25 max-custom:mt-5 origin-top-right rounded-lg bg-[#1d1f3880] backdrop-blur-sm border-3 border-header-outline shadow-lg ring-1 ring-black/5 w-40 max-md:w-[90vw]`}
      >
        <div role="none" className="py-1">
          <Link
            to="/profile/toghrul"
            className="block px-4 py-2 text-lg text-white"
          >
            Profile
          </Link>
          <Link to="/settings" className="block px-4 py-2 text-lg text-white">
            Settings
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
