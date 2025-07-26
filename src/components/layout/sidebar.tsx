"use client";

import clsx from "clsx";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import slugify from "slugify";
import { CATEGORIES } from "../../../constants/categories";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current category from pathname
  const activeCategory = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : "";

  const handleSelect = (category: string) => {
    const categorySlug = slugify(category, { lower: true });
    router.push(`/category/${categorySlug}`);
  };

  return (
    <aside className="w-full hidden md:block md:w-64 border-r mt-12 border-gray-200 bg-white sticky top-16 p-4 h-auto shadow-sm text-sm">
      {/* Create Listing */}
      <div className="mb-6">
        <Link
          href="/create"
          className="w-full inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          <PlusCircle size={18} />
          Create New Listing
        </Link>
      </div>

      {/* Categories */}
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
      <ul className="space-y-1">
        {CATEGORIES.map(({ name, icon: Icon }) => (
          <li key={name}>
            <button
              onClick={() => handleSelect(name)}
              className={clsx(
                "w-full flex items-center gap-2 text-left px-3 py-2 cursor-pointer rounded hover:bg-blue-100 transition",
                activeCategory === slugify(name, { lower: true })
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700"
              )}
            >
              <Icon size={16} />
              {name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
