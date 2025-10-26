type Props = {
  alt?: string;
  source: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export default function BaseImage({ source, alt, className }: Props) {
  return (
    <div className={`overflow-hidden bg-gray-200 ${className ?? ""}`}>
      <img
        src={source}
        alt={alt ?? "image"}
        className="size-full object-cover"
      />
    </div>
  );
}
