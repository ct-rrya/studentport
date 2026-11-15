import type { Metadata } from "next";
import { CampusProvider } from "@/context/CampusContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CtuChatbot } from "@/components/CtuChatbot";
import { readPortalCache } from "@/lib/cache";
import "./globals.css";

export const metadata: Metadata = {
  title: "CTU Student & Campus Portal | Cebu Technological University",
  description:
    "Fast, mobile-first student portal for Cebu Technological University. Browse campus-filtered announcements, 29 CTU campuses, academic programs, and student resources.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let lastSyncedAt: string | undefined;
  try {
    const cache = await readPortalCache();
    lastSyncedAt = cache.syncStatus.lastSyncedAt ?? undefined;
  } catch {
    // fallback if cache isnt readable during build
  }

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#FFF9EC] text-[#2A170B]">
        <CampusProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer lastSyncedAt={lastSyncedAt} />
          <CtuChatbot />
        </CampusProvider>
      </body>
    </html>
  );
}
