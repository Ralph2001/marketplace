"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../libs/supabase";
import { User, Mail, MailCheck, Bell, BellDot } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState<any[]>([]);

  const handleLogout = async () => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      console.error("No active session found. Cannot sign out.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    router.push("/login");
  };

  // Fetch messages + listen for new ones in real-time
  useEffect(() => {
    if (!user?.email) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("seller_email", user.email)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error) {
        setMessageNotifications(data);
        setHasMessages(data.length > 0);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `seller_email=eq.${user.email}`,
        },
        (payload) => {
          setMessageNotifications((prev) => {
            const updated = [payload.new, ...prev].slice(0, 5);
            setHasMessages(true);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Marketplace
        </Link>

        <div className="relative flex items-center gap-4">
          {!user ? (
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Log In
            </Link>
          ) : (
            <>
              {/* 🔔 Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown((prev) => !prev)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-blue-200 rounded-full transition"
                >
                  {hasMessages ? (
                    <BellDot size={20} className="text-blue-600" />
                  ) : (
                    <Bell size={20} className="text-gray-700" />
                  )}
                </button>

                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border z-50 text-sm">
                    <div className="px-4 py-2 border-b font-medium">
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y">
                      {hasMessages ? (
                        messageNotifications.map((msg) => (
                          <div key={msg.id} className="px-4 py-2">
                            <p className="font-semibold text-gray-800 text-sm">
                              New message from:{" "}
                              <span className="text-blue-600">
                                {msg.buyer_email}
                              </span>
                            </p>
                            <p className="text-gray-600 text-xs truncate">
                              {msg.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-gray-500">
                          No new notifications
                        </p>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t">
                      <Link
                        href={`/messages/${user.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View all messages →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 📬 Messages */}
              <Link
                href={`/messages/${user.id}`}
                className="w-8 h-8 flex items-center justify-center hover:bg-blue-200 rounded-full transition"
              >
                {hasMessages ? (
                  <MailCheck size={20} className="text-blue-600" />
                ) : (
                  <Mail size={20} className="text-gray-700" />
                )}
              </Link>

              {/* 👤 Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountDropdown((prev) => !prev)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-blue-200 rounded-full transition"
                >
                  <User size={20} className="text-gray-700" />
                </button>
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                    <Link
                      href={`/profile/${user.id}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
