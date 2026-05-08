import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth";

export const metadata: Metadata = {
  title: "Beacon — Event Manager Dashboard",
  description: "Manage events, volunteers, shifts, and incidents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
