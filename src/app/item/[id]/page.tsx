"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../libs/supabase";
import { toast } from "sonner";
import ImagePreviewGallery from "@/components/ImagePreviewGallery";
import { Listing } from "../../../../types";
import { getRelativeTime } from "../../../../utils/time";
import MessageSeller from "@/components/item/message-sellert";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);

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

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col p-2 h-full bg-blue-50">
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        <div className="w-full md:w-[60%] rounded-2xl">
          <ImagePreviewGallery imageUrls={listing.image_urls || []} />
        </div>

        <div className="w-full md:w-[40%] h-full rounded-lg flex flex-col p-4 bg-white shadow-sm space-y-4">
          <p className="text-2xl font-semibold text-gray-900">
            {listing.title}
          </p>

          <p className="text-xl font-bold text-blue-600">
            ₱
            {new Intl.NumberFormat("en-PH", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(listing.price || 0))}
          </p>

          <div className="text-sm text-gray-500 space-y-1">
            <p>{getRelativeTime(listing.created_at)}</p>
            <p>{listing.location}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Seller Information
            </h3>
            <p className="text-sm text-gray-600 break-all">
              {listing.email_address}
            </p>
          </div>

          <hr className="border-gray-200" />
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
  );
}
