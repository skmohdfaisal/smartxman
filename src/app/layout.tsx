import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
  title: "SmartXMan | Make Smarter Buying Decisions",
  description: "SmartXMan helps students, creators, and professionals discover products worth buying through research-backed recommendations, buying guides, and setup planning.",
  keywords: ["smart product picks", "tech setup", "gaming setup", "creator tools", "productivity", "best tech 2026", "smartxman", "buying guides", "product reviews"],
  authors: [{ name: "SmartXMan Team" }],
  openGraph: {
    title: "SmartXMan | Make Smarter Buying Decisions",
    description: "SmartXMan helps students, creators, and professionals discover products worth buying through research-backed recommendations, buying guides, and setup planning.",
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
    title: "SmartXMan | Make Smarter Buying Decisions",
    description: "Research-backed recommendations for your setup.",
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
              name: 'SmartXMan',
              url: 'https://smartxman.com',
              description: 'SmartXMan helps students, creators, and professionals discover products worth buying through research-backed recommendations.',
              publisher: {
                '@type': 'Organization',
                name: 'SmartXMan',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://smartxman.com/icon.png'
                }
              }
            }),
          }}
        />
      </head>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8V4MGXBBFN"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8V4MGXBBFN');
        `}
      </Script>

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
