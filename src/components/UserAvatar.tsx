import BaseImage from "@/components/BaseImage";

type Props = {
  source?: string;
  fallback?: string;
};

export default function UserAvatar({ source, fallback }: Props) {
  if (source) {
    return (
      <BaseImage
        source={source}
        className="w-8 h-8 rounded-full"
        alt="user photo"
      />
    );
  }
  return (
    <span className="rounded-lg flex items-center justify-center shadow-sm p-1 text-white bg-gray-800">
      {fallback}
    </span>
  );
}
