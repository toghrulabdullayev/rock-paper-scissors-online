import { Link } from "react-router-dom";

const PlayOption = ({ path }) => {
  return (
    <li className="flex justify-center items-center overflow-hidden w-[40vw] max-w-80 h-[40vw] max-h-80 border-3 rounded-xl border-header-outline">
      <Link
        to={`/${path.toLowerCase()}`}
        className="flex justify-center items-center w-full h-full text-white text-6xl"
      >
        <div>{path}</div>
      </Link>
    </li>
  );
};

export default PlayOption;
