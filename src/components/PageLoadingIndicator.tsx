export default function PageLoadingIndicator() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-600/60">
      <div className="size-20 bg-white rounded p-4 flex items-center justify-center">
        <div className="rounded-full border-8 border-gray-800 border-t-blue-700 size-16 animate-spin"></div>
      </div>
    </div>
  );
}
