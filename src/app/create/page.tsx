"use client";

import Link from "next/link";
import {
  Package,
  Layers3,
  Car,
  Home,
  X,
  HelpCircle,
  Tag,
  Tags,
} from "lucide-react";

import clsx from "clsx";

import { usePathname } from "next/navigation";

const listingOptions = [
  {
    title: "Item for Sale",
    description: "Create a single listing for one or more items to sell.",
    href: "/create/item",
    icon: <Package className="w-6 h-6 text-white" />,
  },
  {
    title: "Create Multiple Listings",
    description: "Quickly create multiple listings at the same time.",
    href: "/#",
    icon: <Layers3 className="w-6 h-6 text-white" />,
  },
  {
    title: "Vehicle for Sale",
    description: "Sell a car, truck, or other type of vehicle.",
    href: "/#",
    icon: <Car className="w-6 h-6 text-white" />,
  },
  {
    title: "Home for Sale or Rent",
    description: "List a house or apartment for sale or rent.",
    href: "/#",
    icon: <Home className="w-6 h-6 text-white" />,
  },
];

// const ListingPages = ["Choose listing type", "Your listings", "Help"];

const ListingPages = [
  {
    title: "Choose listing type",
    link: "/create/",
    icon: <Tag className="w-4 h-4 mr-2" />,
  },
  {
    title: "Your listings",
    link: "#",
    icon: <Tags className="w-4 h-4 mr-2" />,
  },
  {
    title: "Help",
    link: "/#",
    icon: <HelpCircle className="w-4 h-4 mr-2" />,
  },
];
export default function CreateListingTypePage() {
  const pathname = usePathname();
  const activeSegment = pathname.startsWith("/create/")
    ? pathname.split("/")[2]
    : "";

  return (
    <div className="flex max-w-screen-xl mx-auto ">
      <aside className="fixed top-0 bottom-0 left-0 w-80 bg-white  shadow-lg p-5 z-50">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="rounded-full bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
          >
            <X size={20} className="text-gray-600" />
          </Link>
          <span className="text-lg font-semibold text-gray-800">
            Create new listing
          </span>
        </div>
        <ul className="space-y-1 ">
          {ListingPages.map((cat) => {
            const segment = cat.link.split("/")[2];
            return (
              <li key={cat.title}>
                <Link href={cat.link}>
                  <button
                    className={clsx(
                      "w-full text-left flex items-center gap-2 px-3 py-2 cursor-pointer rounded hover:bg-blue-100 transition",
                      activeSegment === segment
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700"
                    )}
                  >
                    {cat.icon}
                    {cat.title}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="flex-1 ml-80 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Choose Listing Type</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {listingOptions.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className="flex  items-center h-56 gap-4 flex-col bg-white border border-gray-200 p-4 rounded-2xl shadow-lg hover:shadow-md hover:bg-gray-50 transition"
            >
              <div className="shrink-0 mt-auto mb-auto">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400">
                  {option.icon}
                </div>
              </div>
              <div className="text-center flex flex-col gap-2">
                <h2 className="font-semibold text-gray-800 mt-auto mb-auto">
                  {option.title}
                </h2>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
