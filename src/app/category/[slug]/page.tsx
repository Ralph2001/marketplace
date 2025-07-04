"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Listing = {
  public_id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  location: string;
  email_address: string;
  created_at: string;
  image_urls?: string;
};

const PAGE_SIZE = 40;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoryPage() {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : slug;
  const [search, setSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getKey = (pageIndex: number, previousPageData: Listing[]) => {
    if (previousPageData && previousPageData.length === 0) return null;
    const searchParam = encodeURIComponent(search);
    return `/api/listings?category=${slugStr}&search=${searchParam}&page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<Listing[]>(
    getKey,
    fetcher
  );

  const listings = data ? ([] as Listing[]).concat(...data) : [];
  const isLoading = !data && isValidating;

  // Load next page on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setSize((size) => size + 1);
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current]);

  const readableTitle = slugStr
    ?.split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return (
    <div className="flex max-w-screen-xl mx-auto py-4">
      <Sidebar />
      <main className="flex-1 p-4">
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

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading items...</p>
        ) : listings.length === 0 ? (
          <p className="text-sm text-gray-500">No listings in this category.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {listings.map((item) => (
                <Link key={item.public_id} href={`/item/${item.public_id}`}>
                  <div className="bg-white border rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
                    <div className="relative w-full h-40 bg-gray-100">
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img
                          src={item.image_urls[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-sm space-y-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-blue-600 font-bold">
                        ₱
                        {new Intl.NumberFormat("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(Number(item.price))}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div ref={loadMoreRef} className="h-10" />
            {isValidating && (
              <p className="text-center text-sm mt-4">Loading more...</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
