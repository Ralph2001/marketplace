"use client";

import { useState } from "react";
import { MessageSellerProps } from "../../../types";
import { toast } from "sonner";

import { BadgeCheck, Check, Loader2, SendHorizontal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { createClient } from "../../../utils/supabase/client";

export default function MessageSeller({
  listing,
  currentUserId,
  currentEmail,
  hasSentMessage,
  setHasSentMessage,
}: MessageSellerProps) {
  const [message, setMessage] = useState("I'm interested in your item!");
  const [isSending, setIsSending] = useState(false);

  const supabase = createClient();

  const handleSendEmail = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (listing.user_id === currentUserId) {
      toast.error("You cannot message yourself.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/send-email", {
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Email send failed.");
      }

      const { error } = await supabase.from("messages").insert([
        {
          listing_id: listing.id,
          buyer_email: currentEmail,
          seller_email: listing.email_address,
          message,
        },
      ]);

      if (error) {
        toast.warning("Email sent, but logging failed.");
      } else {
        toast.success("Message sent!");
        setHasSentMessage(true);
        setMessage("I'm interested in your item!");
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-2 p-1">
      <div className="text-md  font-semibold text-gray-800 flex flex-row items-center gap-2">
        {hasSentMessage ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <SendHorizontal size={14} className="text-blue-500" />
        )}
        <p>
          {hasSentMessage ? "Message sent to seller" : "Send seller a message"}
        </p>
      </div>

      {!hasSentMessage && (
        <>
          <Input
            className="resize-none text-sm font-medium"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSendEmail}
            disabled={listing.user_id === currentUserId || isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:cursor-not-allowed"
          >
            {isSending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Send Message
          </Button>
        </>
      )}

      {hasSentMessage && (
        <Link href="/messages/" passHref>
          <Button className="w-full bg-gray-200 shadow-md hover:bg-gray-300 text-gray-800 text-sm font-medium">
            See Conversation
          </Button>
        </Link>
      )}
    </div>
  );
}
