import Link from "next/link";
import { Listing } from "../../../types";

export default function ItemCard({ item }: { item: Listing }) {
  return (
    <Link href={`/item/${item.public_id}`}>
      <div className="bg-white border rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
        <div className="relative w-full h-40 bg-gray-100">
          {item.image_urls && item.image_urls?.length > 0 ? (
            <img
              src={item.image_urls[0]}
              alt={item.title || "Listing image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="p-3 text-sm space-y-1">
          <p className="font-semibold text-gray-900 truncate">{item.title}</p>
          <p className="text-blue-600 font-bold">
            ₱
            {new Intl.NumberFormat("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(item.price))}
          </p>
          <p className="text-gray-500 text-xs truncate">{item.location}</p>
        </div>
      </div>
    </Link>
  );
}
