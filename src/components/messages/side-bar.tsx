"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../libs/supabase";
import Link from "next/link";

type ChatUser = {
  email: string;
};

export default function Sidebar() {
  const { user } = useAuth();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchChatUsers = async () => {
      const { data, error } = await supabase.rpc("get_unique_chat_partners", {
        current_user: user.email,
      });

      if (!error) {
        setChatUsers(data);
      }
    };

    fetchChatUsers();
  }, [user]);

  return (
    <aside className="w-full md:w-64 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Messages</h2>
      {chatUsers.map(({ email }) => (
        <Link href={`/messages/${encodeURIComponent(email)}`} key={email}>
          <div className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer">
            {email}
          </div>
        </Link>
      ))}
    </aside>
  );
}
