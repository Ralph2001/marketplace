import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export default function TopBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) {
  return (
    <div className="flex items-start w-full md:items-center flex-col-reverse md:justify-between gap-4 md:gap-4 mb-4">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-semibold">Today's pick</p>
        <p className="flex flex-row items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} className="text-blue-600" />
          <span className="text-blue-600">Location</span>
        </p>
      </div>
      <div className="w-full max-w-xs ml-auto">
        <Input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );
}
