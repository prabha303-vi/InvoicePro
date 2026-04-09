import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InvoicePro - Professional Invoice Management",
    template: "%s | InvoicePro",
  },
  description: "Create, manage, and download professional invoices with ease. Built with Next.js and modern web technologies.",
  keywords: ["invoice", "billing", "accounting", "business", "PDF", "management"],
  authors: [{ name: "InvoicePro Team" }],
  creator: "InvoicePro",
  publisher: "InvoicePro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://invoicepro.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://invoicepro.app",
    title: "InvoicePro - Professional Invoice Management",
    description: "Create, manage, and download professional invoices with ease.",
    siteName: "InvoicePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePro - Professional Invoice Management",
    description: "Create, manage, and download professional invoices with ease.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
