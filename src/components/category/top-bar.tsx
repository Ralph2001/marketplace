import React from "react";
import { Input } from "../ui/input";

interface TopBarProps {
  readableTitle?: string;
  search: string;
  setSearch: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  readableTitle,
  search,
  setSearch,
}) => {
  return (
    <div className="flex items-start flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4">
      <h1 className="text-xl font-semibold text-gray-800 capitalize">
        {readableTitle} Items
      </h1>
      <div className="w-full max-w-xs ml-auto">
        <Input
          placeholder="Search in category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default TopBar;
