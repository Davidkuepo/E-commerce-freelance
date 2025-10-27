import { type ReactNode } from "react";
import { type FieldError } from "react-hook-form";

type Props = {
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  hint?: string;
  error?: FieldError;
  suffixIcon?: ReactNode;
  [id: string]: unknown;
};

export default function TextInput({
  label,
  type,
  placeholder,
  hint,
  error,
  suffixIcon,
  name,
  disabled,
  ...rest
}: Props) {
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
          type={type ?? "text"}
          placeholder={placeholder}
          disabled={disabled}
          id={name}
          name={name}
          {...rest}
        />

        {suffixIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors">
            {suffixIcon}
          </span>
        )}
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
