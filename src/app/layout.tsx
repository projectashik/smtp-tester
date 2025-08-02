import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
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
  metadataBase: new URL("https://smtp.cban.top"),
  title:
    "SMTP Tester - Professional Email Server Testing Tool | Free Online SMTP Test",
  description:
    "Test your SMTP server configuration with our professional, secure, and free online SMTP testing tool. Verify email delivery, authentication, and troubleshoot SMTP issues instantly. Supports Gmail, Outlook, SendGrid, Mailgun, and custom SMTP servers.",
  keywords: [
    "SMTP tester",
    "email server test",
    "SMTP configuration",
    "email delivery test",
    "SMTP authentication",
    "email troubleshooting",
    "SMTP debugging",
    "mail server test",
    "email testing tool",
    "SMTP validator",
    "Gmail SMTP",
    "Outlook SMTP",
    "SendGrid test",
    "Mailgun test",
    "email server validation",
  ],
  authors: [{ name: "SMTP Tester Team" }],
  creator: "SMTP Tester",
  publisher: "SMTP Tester",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smtp.cban.top",
    siteName: "SMTP Tester",
    title: "SMTP Tester - Professional Email Server Testing Tool",
    description:
      "Test your SMTP server configuration with our professional, secure, and free online SMTP testing tool. Verify email delivery, authentication, and troubleshoot SMTP issues instantly.",
    images: [
      {
        url: "/api/og?title=SMTP Tester - Professional Email Server Testing Tool&description=Test and validate your SMTP server configuration instantly",
        width: 1200,
        height: 630,
        alt: "SMTP Tester - Professional Email Server Testing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMTP Tester - Professional Email Server Testing Tool",
    description:
      "Test your SMTP server configuration with our professional, secure, and free online SMTP testing tool.",
    images: [
      "/api/og?title=SMTP Tester - Professional Email Server Testing Tool&description=Test and validate your SMTP server configuration instantly",
    ],
    creator: "@chapagainashik",
  },
  alternates: {
    canonical: "https://smtp.cban.top",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
