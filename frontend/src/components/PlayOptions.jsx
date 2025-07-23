import PlayOption from "../ui/PlayOption";

const PlayOptions = () => {
  return (
    <ul className="mt-16 flex justify-between items-center h-fit">
      <PlayOption path="Cpu" />
      <PlayOption path="Online" />
    </ul>
  );
};

export default PlayOptions;
