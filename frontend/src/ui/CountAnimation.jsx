import { useEffect } from "react";

import { motion, animate, useMotionValue, useTransform } from "motion/react";
import { useSelector } from "react-redux";

const CountAnimation = () => {
  const score = useSelector((state) => state.game.score);

  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, score, { duration: 2 });
    return () => {
      controls.stop();
    };
  }, [count, score]);

  return (
    <motion.h2 className="text-dark-text text-6xl text-center font-bold max-custom:text-4xl">
      {rounded}
    </motion.h2>
  );
};

export default CountAnimation;
