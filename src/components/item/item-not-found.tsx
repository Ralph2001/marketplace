import { SearchX } from "lucide-react";
import React from "react";

interface ItemNotFoundProps {
  searchTerm: string;
}
const ItemNotFound: React.FC<ItemNotFoundProps> = ({ searchTerm = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <SearchX className="h-12 w-12 mb-4" />
      <p className="text-lg font-light">No results found for "{searchTerm}"</p>
    </div>
  );
};

export default ItemNotFound;
