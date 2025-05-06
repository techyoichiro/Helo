import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";

export const metadata: Metadata = {
  title: "Helo",
  description: "A web service that enables centralized management of bookmarks from IT tech blogs like Qiita, Zenn, Hatena Blog, and note. Easily view and organize bookmarked articles from multiple platforms in one place for easy re-reading and reference, supporting efficient management of technical information.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="jp">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 min-h-0 overflow-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
