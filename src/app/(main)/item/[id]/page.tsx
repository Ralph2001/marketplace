"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Listing } from "../../../../../types";
import { getRelativeTime } from "../../../../../utils/time";
import { createClient } from "../../../../../utils/supabase/client";

import { User } from "lucide-react";
import { CATEGORIES } from "../../../../../constants/categories";
import ImageGallery from "@/components/ImageGallery";
import MessageSeller from "@/components/item/message-sellert";

export default function ItemDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasMessaged, setHasMessaged] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // ✅ Step 1: Auth check (redirect if not logged in)
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!data.user) {
        toast.error("Please log in to continue.");
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setUserEmail(data.user.email ?? null);
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Step 2: Load item data
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error("Failed to load item.");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // ✅ Step 3: Check if user has already sent a message
  useEffect(() => {
    const checkMessages = async () => {
      if (!listing?.id || !userEmail) return;

      const { data, error } = await supabase
        .from("messages")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_email", userEmail);

      if (!error && data.length > 0) setHasMessaged(true);
    };

    checkMessages();
  }, [listing?.id, userEmail]);

  // ✅ Global Loading State
  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!listing) {
    return <div className="p-10 text-center text-red-500">Item not found.</div>;
  }

  return (
    <main className="flex-1 bg-gray-50 p-4 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 md:h-[calc(100vh-5rem)]">
        <ImageGallery
          images={listing.image_urls}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="w-full md:w-[500px] border flex flex-col rounded-md p-4 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-gray-700">
            <div className="mb-4 md:hidden block">
              <MessageSeller
                listing={listing}
                currentUserId={userId}
                currentEmail={userEmail}
                hasSentMessage={hasMessaged}
                setHasSentMessage={setHasMessaged}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 break-words">
                {listing.title}
              </h3>
              <p className="text-blue-600 font-bold text-base">
                ₱
                {Number(listing.price).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {(() => {
                const category = CATEGORIES.find(
                  (c) => c.name === listing.category
                );
                if (!category)
                  return <p className="text-xs">{listing.category}</p>;

                const Icon = category.icon;
                return (
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                );
              })()}

              <p className="text-xs text-gray-500">
                {getRelativeTime(listing.created_at)}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-800">Details</p>
              <p className="break-words">
                {listing.description || "No description provided."}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-800">
                {listing.location || "No location given"}
              </p>
              <p className="text-xs text-gray-500">Location is approximate</p>
            </div>

            <hr className="border-gray-300" />

            <div>
              <p className="font-semibold text-sm text-gray-800">Seller Info</p>
              <div className="flex items-center gap-2 text-gray-600 break-all">
                <User size={16} className="text-gray-500" />
                {listing.email_address}
              </div>
            </div>
          </div>

          <div className="hidden md:block pt-4 border-t border-gray-200">
            <MessageSeller
              listing={listing}
              currentUserId={userId}
              currentEmail={userEmail}
              hasSentMessage={hasMessaged}
              setHasSentMessage={setHasMessaged}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
