import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Beacon — Event Manager Dashboard",
  description: "Manage events, volunteers, shifts, and incidents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <Nav />
          <main className="min-h-screen py-8">
            <div className="max-w-lg mx-auto px-4">{children}</div>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
