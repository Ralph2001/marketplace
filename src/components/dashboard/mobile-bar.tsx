"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BadgePlus, List, X } from "lucide-react";
import { Button } from "../ui/button";
import { CATEGORIES } from "../../../constants/categories";
import { useRouter } from "next/navigation";
import slugify from "slugify";

const MobileBar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();

  const handleSelect = (category: string) => {
    const categorySlug = slugify(category, { lower: true });
    setShowCategories(false); // Close popup
    router.push(`/category/${categorySlug}`);
  };

  useEffect(() => {
    if (showCategories) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCategories]);

  return (
    <>
      {/* Bottom Bar */}
      <div className="grid grid-cols-2 gap-2 w-full sm:hidden md:hidden">
        <Link
          href={"/create"}
          className="items-center w-full gap-2 h-10 active:text-blue-600 hover:text-blue-400 flex justify-center rounded-3xl py-2 hover:bg-gray-300 bg-gray-200 font-medium text-gray-700 active:bg-gray-300 transition-all duration-300"
        >
          <BadgePlus size={14} /> Sell
        </Link>
        <Button
          onClick={() => setShowCategories(true)}
          className="items-center w-full gap-2 flex h-10 justify-center rounded-3xl py-2 bg-gray-200 font-medium text-gray-700 hover:bg-gray-300 active:bg-gray-300 hover:text-blue-400 transition-all duration-300"
        >
          <List size={14} /> Categories
        </Button>
      </div>

      {/* Pop-up Bottom Sheet */}
      {showCategories && (
        <div className="fixed inset-0 z-50 bg-black/10 flex items-end sm:hidden md:hidden">
          <div className="bg-white w-full max-h-[70vh] rounded-t-2xl p-4 flex flex-col">
            {/* Sticky Header */}
            <div className="flex justify-between items-center h-10 mb-2 border-b pb-2">
              <h2 className="text-lg font-semibold">Browse Categories</h2>
              <button
                onClick={() => setShowCategories(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X />
              </button>
            </div>

            {/* Scrollable Category List */}
            <div className="overflow-y-auto  hide-scrollbarflex-grow">
              <ul className="space-y-2">
                {CATEGORIES.map(({ name, icon: Icon }) => (
                  <li key={name}>
                    <button
                      onClick={() => handleSelect(name)}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-blue-100 transition text-gray-800"
                    >
                      <Icon size={16} />
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBar;
