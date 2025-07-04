"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2Icon, Mail, X } from "lucide-react";
import { supabase } from "../../../../libs/supabase";
import { toast } from "sonner";
import ImagePreviewGallery from "@/components/ImagePreviewGallery";

type Listing = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  location: string;
  email_address: string;
  created_at: string;
  image_urls?: string[];
  user_id: string;
  public_id: string;
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("I'm interested in your item!");
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
      setCurrentEmail(data.user?.email ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkIfSentMessage = async () => {
      if (!listing?.id || !currentEmail) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listing.id)
        .eq("buyer_email", currentEmail);

      if (data && data.length > 0) {
        setHasSentMessage(true);
      }
    };

    checkIfSentMessage();
  }, [listing?.id, currentEmail]);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data);
        setSelectedImage(data.image_urls?.[0] || null);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex fixed z-50 inset-0  items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!listing) return <div className="p-10 text-red-500">Item not found</div>;

  const handleSendEmail = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message before sending.");
      return;
    }

    if (listing.user_id === currentUserId) {
      toast.error("You cannot message yourself. :P");
      return;
    }

    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);

    // return;

    try {
      // 1. Send email
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: listing.email_address,
          senderEmail: currentEmail,
          subject: `Interest in your listing: ${listing.title}`,
          text: message,
          itemId: listing.public_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Email error:", result);
        toast.error(
          `Failed to send message: ${result.error || "Unknown error"}`
        );
        setIsLoading(false);
        return;
      }

      // 2. Store message in Supabase
      const { error: insertError } = await supabase.from("messages").insert([
        {
          listing_id: listing.id,
          buyer_email: currentEmail,
          seller_email: listing.email_address,
          message,
        },
      ]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        toast.error("Message sent via email, but failed to log in system.");
        setIsLoading(false);
        return;
      }

      // 3. Success toast + reset message
      toast.success("Message sent successfully!");
      setMessage("I'm interested in your item!"); // Reset message box
      setHasSentMessage(true); // Indicate message was sent
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setIsLoading(false);
      toast.error("Something went wrong while sending the message.");
    }
  };

  function getRelativeTime(date: string | Date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // in seconds

    if (diff < 60) return `Listed ${diff} seconds ago`;
    if (diff < 3600) return `Listed ${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `Listed ${Math.floor(diff / 3600)} hours ago`;
    return `Listed ${Math.floor(diff / 86400)} days ago`;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-8  flex flex-col gap-2 py-4 h-full">
      {/* <div className="h-10">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700"
          aria-label="Back"
        >
          <X className="w-5 h-5" />
        </Link>
      </div> */}
      <div className="flex flex-col md:flex-row gap-4">
        <ImagePreviewGallery imageUrls={listing.image_urls || []} />

        <div className="grow rounded-lg flex flex-col px-4 py-6 bg-white shadow-sm space-y-4">
          {/* Title */}
          <p className="text-2xl font-semibold text-gray-900">
            {listing.title}
          </p>

          {/* Price */}
          <p className="text-xl font-bold text-blue-600">
            {listing.price
              ? `₱${new Intl.NumberFormat("en-PH", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(listing.price))}`
              : "₱0.00"}
          </p>

          {/* Meta Info */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>{getRelativeTime(listing.created_at)}</p>
            <p>{listing.location}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Seller Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Seller Information
            </h3>
            <p className="text-sm text-gray-600 break-all">
              {listing.email_address}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Message Seller */}
          {/* {listing.user_id !== currentUserId && ( */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Message Seller
            </h3>

            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 font-medium">
              <Mail size={14} className="text-blue-600" />
              <p className="text-md">Send an email to the seller</p>
            </div>

            <Textarea
              className="resize-none text-sm font-medium"
              placeholder="Type your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={handleSendEmail}
              disabled={listing.user_id === currentUserId || isLoading}
              className="w-full bg-blue-600 cursor-pointer disabled:cursor-not-allowed hover:bg-blue-700 text-white text-sm font-medium"
            >
              {isLoading ? <Loader2Icon className="animate-spin" /> : null}

              {hasSentMessage ? "Send Message Again" : "Send Message"}
            </Button>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
