import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartxman.com"),
  title: "smartXman | Smart Product Picks That Actually Make Sense",
  description: "Discover curated tech, setup, gaming, and lifestyle products recommended with real research.",
  keywords: ["smart product picks", "smart picks", "best smart product picks", "tech setup", "gaming setup", "creator tools", "productivity", "best tech 2026", "smartxman"],
  authors: [{ name: "smartXman Team" }],
  openGraph: {
    title: "smartXman | Smart Product Picks That Actually Make Sense",
    description: "Discover curated tech, setup, gaming, and lifestyle products recommended with real research.",
    url: "https://smartxman.com",
    siteName: "smartXman",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "smartXman - Curated Product Recommendations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "smartXman | Smart Product Picks",
    description: "Discover curated tech and setup recommendations.",
    images: ["/og-image.png"],
    creator: "@smartxman",
  },

  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'smartXman',
              url: 'https://smartxman.com',
              description: 'Discover curated tech, setup, gaming, and lifestyle products recommended with real research.',
              publisher: {
                '@type': 'Organization',
                name: 'smartXman',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://smartxman.com/icon.png'
                }
              }
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
