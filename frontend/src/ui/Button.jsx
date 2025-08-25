import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  onClick,
  fill,
  className,
  responsive,
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={twMerge(`${
        responsive
          ? "max-custom:text-sm max-custom:px-6 max-custom:py-1"
          : undefined
      }
          uppercase px-8 py-2 border-3 rounded-xl border-header-outline tracking-widest cursor-pointer
          ${
            fill ? "text-dark-text bg-white border-0" : "text-white"
          } ${className}
        `)}
    >
      {children}
    </button>
  );
};

export default Button;
