import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../../context/AuthContext";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "MarketPlace",
  description: "Created by Ralph",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <Header />
          <Toaster position="top-right" richColors expand />
          <main className="flex-1 ">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

