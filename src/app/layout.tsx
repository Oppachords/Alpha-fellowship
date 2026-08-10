import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Alpha Fellowship Uganda",
    template: "%s | Alpha Fellowship Uganda",
  },
  description:
    "A non-denominational fellowship working among young people in Kampala, Uganda. Setting Ablaze all Nations for Christ.",
  openGraph: {
    type: "website",
    locale: "en_UG",
    siteName: "Alpha Fellowship Uganda",
    title: "Alpha Fellowship Uganda",
    description:
      "A non-denominational fellowship working among young people in Kampala, Uganda. Setting Ablaze all Nations for Christ.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Fellowship Uganda",
    description:
      "A non-denominational fellowship working among young people in Kampala, Uganda.",
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
    <html lang="en" className={`${nunito.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
