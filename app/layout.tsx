import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dolis-boutique.vercel.app"),

  title: {
    default: "Doli's Boutique",
    template: "%s | Doli's Boutique",
  },

  description:
    "পিরোজপুর, বনগাঁ-র home-based customised blouse making service। আপনার পছন্দের design ও মাপ অনুযায়ী blouse তৈরি করা হয়।",

  keywords: [
    "Doli's Boutique",
    "Doli Boutique",
    "Blouse Making Bongaon",
    "Custom Blouse Bongaon",
    "Blouse Designer Bongaon",
    "Pirojpur Bongaon Blouse",
    "Custom Blouse West Bengal",
  ],

  authors: [{ name: "Doli's Boutique" }],
  creator: "Doli's Boutique",
  publisher: "Doli's Boutique",

  openGraph: {
    title: "Doli's Boutique",
    description:
      "পিরোজপুর, বনগাঁ-র home-based customised blouse making service। আপনার পছন্দের design ও মাপ অনুযায়ী blouse তৈরি করা হয়।",
    url: "https://dolis-boutique.vercel.app",
    siteName: "Doli's Boutique",
    locale: "bn_IN",
    type: "website",
    images: [
      {
        url: "/images/doli-mother.jpg",
        width: 1200,
        height: 630,
        alt: "Doli's Boutique",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Doli's Boutique",
    description:
      "পিরোজপুর, বনগাঁ-র customised blouse making service।",
    images: ["/images/doli-mother.jpg"],
  },

  icons: {
    icon: "/images/doli-mother.jpg",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}