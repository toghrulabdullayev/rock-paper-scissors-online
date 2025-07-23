const Input = ({ className, ...props }) => {
  return (
    <input
      {...props}
      autoComplete="off"
      className={`px-8 py-2 border-3 rounded-xl border-header-outline tracking-widest text-white ${className} outline-none w-full mt-4`}
    />
  );
};

export default Input;
