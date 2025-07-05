"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../libs/supabase";
import { Message } from "../../../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  listingId: number;
  buyerEmail: string;
  sellerEmail: string;
};

export default function LiveMessages({
  listingId,
  buyerEmail,
  sellerEmail,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return setMessages([]);

      const res = await fetch(`/api/messages`);
      const result = await res.json();

      if (!Array.isArray(result)) return setMessages([]);

      // Only show messages related to this user
      const filtered = result.filter(
        (msg: Message) =>
          msg.buyer_email === user.email || msg.seller_email === user.email
      );

      setMessages(filtered);
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
    
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        listing_id: listingId,
        buyer_email: buyerEmail,
        seller_email: sellerEmail,
        message: newMessage,
      }),
    });

    setNewMessage("");
  };

  return (
    <div className="w-full max-w-xl mx-auto h-full flex justify-center items-center flex-col">
      <div className="bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-auto flex flex-col w-full gap-2 mb-4">
        {messages &&
          messages.map((msg) => (
            <div key={msg.id} className="text-sm text-gray-800">
              <strong>
                {msg.buyer_email === buyerEmail ? "You" : "Seller"}:
              </strong>{" "}
              {msg.message}
            </div>
          ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
