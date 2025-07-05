
export default function Loader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}
