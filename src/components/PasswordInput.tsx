import { type FieldError } from "react-hook-form";
import { useState } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  hint?: string;
  error?: FieldError;
  [id: string]: unknown;
};

export default function PasswordInput({
  label,
  placeholder,
  hint,
  error,
  name,
  disabled,
  ...rest
}: Props) {
  const [type, setType] = useState("password");

  const toggleType = () => {
    if (type === "text") setType("password");
    else setType("text");
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          className="block w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-gray-800
            placeholder:text-gray-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500
            focus:ring-offset-1 transition-all duration-200 outline-none disabled:opacity-60 text-sm sm:text-base"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          id={name}
          name={name}
          {...rest}
        />
        <span
          onClick={toggleType}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm cursor-pointer"
        >
          {type === "password" ? "Show" : "Hide"}
        </span>
      </div>

      {hint && <span className="text-xs text-gray-500 mt-1">{hint}</span>}
      {error && (
        <span className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
