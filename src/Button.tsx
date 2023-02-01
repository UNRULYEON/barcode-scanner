import { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      className="rounded-full bg-stone-800 p-3 font-bold transition-all hover:bg-stone-900"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
