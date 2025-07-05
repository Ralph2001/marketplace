import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CategoryBadgeProps {
  readableTitle?: string;
}
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ readableTitle }) => {
  return (
    <div className="w-full mb-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
        <span>{readableTitle}</span>
        <Link
          href="/"
          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition"
          aria-label="Clear filter"
        >
          <X size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CategoryBadge;
