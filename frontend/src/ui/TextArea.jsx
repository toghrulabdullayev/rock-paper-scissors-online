const TextArea = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      rows={10}
      autoComplete="off"
      className={`resize-none leading-3 px-8 py-3.5 border-3 rounded-xl border-header-outline tracking-widest text-white ${className} outline-none w-full mt-4`}
    />
  );
};

export default TextArea;
