import { type ReactNode } from "react";
import { type FieldError } from "react-hook-form";

type Props = {
  label?: string;
  rows?: number;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  hint?: string;
  error?: FieldError;
  suffixIcon?: ReactNode;
  [id: string]: unknown;
};

export default function TextareaInput({
  label,
  placeholder,
  rows,
  hint,
  error,
  disabled,
  name,
  ...rest
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <textarea
        className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800
        placeholder:text-gray-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500
            focus:ring-offset-1 transition-all duration-200 outline-none disabled:opacity-60 text-sm sm:text-base"
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        {...rest}
      />

      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
