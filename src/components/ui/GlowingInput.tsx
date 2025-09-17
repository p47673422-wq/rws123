import { InputHTMLAttributes } from "react";

type GlowingInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function GlowingInput(props: GlowingInputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-yellow-900 font-semibold shadow ${props.className || ""}`}
    />
  );
}
