import { GESTURES, POSITIONS } from "../constants/gestures";
import Gesture from "../ui/Gesture";

const Gestures = () => {
  return (
    <div className="flex flex-col items-center w-94">
      <ul className="flex justify-between h-52 w-full max-custom:w-70 max-custom:h-56">
        {Array.from({ length: 3 }).map((_, i) => (
          <Gesture key={GESTURES[i].move} {...GESTURES[i]} {...POSITIONS[i]} />
        ))}
      </ul>
      <ul className="mt-18 flex justify-between w-66 max-custom:w-52 max-custom:mt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Gesture key={GESTURES[i + 3].move} {...GESTURES[i + 3]} />
        ))}
      </ul>
    </div>
  );
};

export default Gestures;
