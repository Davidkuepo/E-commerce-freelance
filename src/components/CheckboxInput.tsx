import type { FieldError } from "react-hook-form";

type Props = {
  name: string;
  hint?: string;
  label: string;
  error?: FieldError;
  [id: string]: unknown;
};

export default function CheckboxInput({
  name,
  hint,
  label,
  error,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          {...rest}
          className="size-5 shrink-0 accent-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
        />
        <span className="text-gray-700 text-sm sm:text-base">{label}</span>
      </label>
      {hint && !error && (
        <span className="text-xs text-gray-500 mt-1">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
