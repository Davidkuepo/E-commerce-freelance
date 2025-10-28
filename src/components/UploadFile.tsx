import React, { useEffect, useState } from "react";
import type { FieldError } from "react-hook-form";

export default function UploadFile({
  error,
  label,
  name,
  ...rest
}: {
  [id: string]: unknown;
  error?: FieldError;
  label: string;
  name: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <div className="relative overflow-hidden border-dashed rounded-lg">
        <input
          id={name}
          type="file"
          className="opacity-0 absolute inset-0 size-full z-[5px]"
          multiple={false}
          accept="image/png, image/jpeg"
          onChange={onFileChange}
          {...rest}
        />
        <span>upload here</span>
      </div>
      {preview && (
				<div className="bg-gray-100 size-10 rounded-lg">
					<img className="size-full rounded-lg" src={preview} alt="preview" />
				</div>
      )}
      {error && <span className="text-xs text-red-600">{error.message}</span>}
    </div>
  );
}
