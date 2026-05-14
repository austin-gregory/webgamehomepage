import type { Metadata } from "next";
import { TerminalNav } from "@/components/TerminalNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dark Game Factory",
  description:
    "Solo, AI-native game studio. Prototypes, devlogs, and signals from the back room.",
  metadataBase: new URL("https://darkgamefactory.com"),
  openGraph: {
    title: "Dark Game Factory",
    description: "Solo, AI-native game studio.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Game Factory",
    description: "Solo, AI-native game studio.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=VT323&display=swap"
          rel="stylesheet"
        />
        {/* Start the 8 MB hero model download immediately, in parallel with
            the JS bundle. By the time HeroRoom hydrates and asks for the
            file, it's already in the browser cache. */}
        <link
          rel="preload"
          as="fetch"
          href="/hero.glb"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-black text-zinc-200 antialiased">
        <TerminalNav />
        {children}
      </body>
    </html>
  );
}
