// components/item/item-skeleton.tsx
export default function ItemSkeleton() {
  return (
    <div className="bg-white border rounded shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
