import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HH Goa 2026 Frame Studio | #FrameInGoa",
  description:
    "Create your Hacker House Goa 2026 branded frame, Builder ID card, or Team Frame in seconds. Upload, crop, customize — download & share to X instantly.",
  keywords: ["HH Goa", "Hacker House Goa", "FrameInGoa", "hackathon", "2026"],
  openGraph: {
    title: "HH Goa 2026 Frame Studio",
    description:
      "Generate your Hacker House Goa 2026 pass in seconds. #FrameInGoa",
    type: "website",
    url: "https://hhgoa-frame.vercel.app",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "HH Goa 2026 Frame Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 Frame Studio",
    description:
      "Generate your Hacker House Goa 2026 pass in seconds. #FrameInGoa",
    images: ["/og-default.png"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body min-h-screen bg-green-deep">{children}</body>
    </html>
  );
}
