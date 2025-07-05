"use client";

import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Listing } from "../../types";
import { MAX_PAGE_SIZE } from "../../constants/page";
import Loader from "@/components/ui/loader";
import ItemCard from "@/components/item/item-card";
import TopBar from "@/components/dashboard/top-bar";
import ItemNotFound from "@/components/item/item-not-found";
import ItemSkeleton from "@/components/item/item-skeleton";
import { toast } from "sonner";
import MobileBar from "@/components/dashboard/mobile-bar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSize(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const getKey = useCallback(
    (pageIndex: number, previousData: Listing[]) => {
      if (previousData && previousData.length === 0) return null;
      return `/api/listings?page=${pageIndex + 1}&limit=${MAX_PAGE_SIZE}&search=${encodeURIComponent(searchTerm)}`;
    },
    [searchTerm]
  );

  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    Listing[]
  >(getKey, fetcher);

  if (error) {
    toast.error("Failed to load listings. Please try again later.");
  }

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

  if (loading || !user) return null;

  return (
    <div className="flex max-w-screen-xl mx-auto py-4">
      {/* Category */}

      <Sidebar />
      <main className="flex-1 flex flex-col gap-4 p-4">
        <MobileBar />
        <hr className="md:hidden"/>
        <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 transition-opacity duration-500 opacity-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <ItemSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          searchTerm ? (
            <ItemNotFound searchTerm={searchTerm} />
          ) : (
            <p className="text-gray-500 text-sm">No listings found.</p>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 transition-opacity duration-500 opacity-100 ">
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
