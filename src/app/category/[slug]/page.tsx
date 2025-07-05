"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { MAX_PAGE_SIZE } from "../../../../constants/page";
import Loader from "@/components/ui/loader";
import ItemCard from "@/components/item/item-card";
import ItemSkeleton from "@/components/item/item-skeleton";
import ItemNotFound from "@/components/item/item-not-found";
import { Listing } from "../../../../types";
import TopBar from "@/components/category/top-bar";
import CategoryBadge from "@/components/category/category-badge";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoryPage() {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : slug;
  const [search, setSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: Listing[]) => {
      if (previousPageData && previousPageData.length === 0) return null;
      const searchParam = encodeURIComponent(search);
      return `/api/listings?category=${slugStr}&search=${searchParam}&page=${pageIndex + 1}&limit=${MAX_PAGE_SIZE}`;
    },
    [search, slugStr]
  );

  const { data, size, setSize, isValidating } = useSWRInfinite<Listing[]>(
    getKey,
    fetcher
  );

  const listings = data ? ([] as Listing[]).concat(...data) : [];
  const isLoading = !data && isValidating;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setSize((s) => s + 1);
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []);

  const readableTitle = slugStr
    ?.split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return (
    <div className="flex max-w-screen-xl mx-auto py-4">
      <Sidebar />
      <main className="flex-1 p-4">
        <TopBar
          readableTitle={readableTitle}
          search={search}
          setSearch={setSearch}
        />

        <CategoryBadge readableTitle={readableTitle} />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <ItemSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          search ? (
            <ItemNotFound searchTerm={search} />
          ) : (
            <p className="text-sm text-gray-500">
              No listings in this category.
            </p>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {listings.map((item) => (
                <ItemCard key={item.public_id} item={item} />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-10" />
            {isValidating && <Loader message="Loading more..." />}
          </>
        )}
      </main>
    </div>
  );
}
