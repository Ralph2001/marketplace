"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../libs/supabase";
import { toast } from "sonner";
import { Listing } from "../../../../types";
import { getRelativeTime } from "../../../../utils/time";
import MessageSeller from "@/components/item/message-sellert";
import { User, Map, ChevronLeft, ChevronRight, X } from "lucide-react";

import Image from "next/image";
import { CATEGORIES } from "../../../../constants/categories";
import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";
export default function ItemDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Scroll to selected thumbnail
  const scrollToThumbnail = (index: number) => {
    const container = thumbnailRef.current;
    const thumbnail = container?.children[index] as HTMLElement | undefined;
    if (thumbnail && container) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumbnail.getBoundingClientRect();

      if (
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right
      ) {
        container.scrollBy({
          left:
            thumbRect.left -
            containerRect.left -
            container.clientWidth / 2 +
            thumbRect.width / 2,
          behavior: "smooth",
        });
      }
    }
  };

  const handleArrowClick = (direction: "left" | "right") => {
    let newIndex =
      direction === "left"
        ? (selectedImage - 1 + (listing?.image_urls.length ?? 0)) %
          (listing?.image_urls.length ?? 1)
        : (selectedImage + 1) % (listing?.image_urls.length ?? 1);

    setSelectedImage(newIndex);
    scrollToThumbnail(newIndex);
  };

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth error:", error.message);
        toast.error("Failed to get user information.");
        return;
      }
      setCurrentUserId(data.user?.id ?? null);
      setCurrentEmail(data.user?.email ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error("Item not found.");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        toast.error("Failed to load item details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    const checkMessage = async () => {
      if (!listing?.id || !currentEmail) return;
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listing.id)
        .eq("buyer_email", currentEmail);

      if (error) {
        console.error("Error checking messages:", error.message);
        return;
      }

      if (data && data.length > 0) setHasSentMessage(true);
    };

    checkMessage();
  }, [listing?.id, currentEmail]);

  if (loading) {
    return (
      <div className="flex fixed inset-0 items-center justify-center z-50">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!listing) {
    return <div className="p-10 text-red-500 text-center">Item not found.</div>;
  }

  const images = listing.image_urls.map((url) => ({
    original: url,
    thumbnail: url,
  }));

  return (
    <main className="flex-1 bg-gray-50 p-4 relative max-w-screen-2xl mx-auto h-full ">
      {/* <div className="w-full  mb-2 h-8 md:hidden flex items-center px-2">
        <Link
          href="/"
          className="flex items-center justify-center bg-gray-200 border border-gray-300 w-8 h-8 rounded-full"
        >
          <X size={14} className="text-gray-800" />
        </Link>
      </div> */}

      <div className="flex flex-col md:flex-row gap-4  md:h-[calc(100vh-5rem)] ">
        <ImageGallery
          images={listing.image_urls}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="w-full  md:ml-auto md:w-[500px] border flex flex-col rounded-md p-4 h-full bg-white shadow-sm">
          <div className="flex flex-col w-full h-full text-sm text-gray-700">
            {/* Make this scrollable and take all available vertical space */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Your content */}

              <div className="mb-4 md:hidden block ">
                <MessageSeller
                  listing={listing}
                  currentUserId={currentUserId}
                  currentEmail={currentEmail}
                  hasSentMessage={hasSentMessage}
                  setHasSentMessage={setHasSentMessage}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900 break-words">
                  {listing.title}
                </h3>
                <p className="text-blue-600 font-bold text-base">
                  {listing.price
                    ? `₱${new Intl.NumberFormat("en-PH", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(listing.price))}`
                    : "₱0.00"}
                </p>

                {(() => {
                  const category = CATEGORIES.find(
                    (cat) => cat.name === listing.category
                  );
                  if (!category)
                    return (
                      <p className="text-xs text-gray-600">
                        {listing.category}
                      </p>
                    );

                  const Icon = category.icon;

                  return (
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                  );
                })()}
                <div className="text-xs text-gray-500">
                  <p>{getRelativeTime(listing.created_at)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-gray-800">Details</p>
                <p className="break-words">
                  {listing.description || "Description will appear here..."}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="font-medium text-gray-800 break-words">
                  {listing.location || "Location not provided"}
                </p>
                <p className="text-xs text-gray-500">Location is approximate</p>
              </div>

              <hr className="border-gray-300 my-4" />

              <div className="space-y-2">
                <p className="font-semibold text-sm text-gray-800">
                  Seller Information
                </p>
                <div className="flex items-center gap-2 break-all text-gray-600">
                  <User size={16} className="text-gray-500" />
                  {listing.email_address}
                </div>
              </div>
            </div>

            {/* Message section fixed to bottom */}
            <div className="mt-4 hidden md:block pt-4 border-t border-gray-200">
              <MessageSeller
                listing={listing}
                currentUserId={currentUserId}
                currentEmail={currentEmail}
                hasSentMessage={hasSentMessage}
                setHasSentMessage={setHasSentMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
