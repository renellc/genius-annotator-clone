import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={
        [
          "px-3 py-2 text-white rounded-md",
          "bg-slate-900 hover:bg-slate-800 active:bg-slate-600",
        ].join(" ") +
          " " +
          props.className ?? ""
      }
    />
  );
};
