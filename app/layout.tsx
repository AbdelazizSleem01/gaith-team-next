import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.elbash-mo3alem.com"),
  title: {
    default: "GAITH TEAM - الامتحان في جيبك",
    template: "%s | GAITH TEAM",
  },
  description:
    "منصة GAITH TEAM المتخصصة في اختبارات التمريض الإلكترونية مع نظام كاميرات وأمان لمنع الغش. اختبر نفسك في جميع فروع التمريض مع تجربة تفاعلية ذكية.",
  keywords: [
    "تمريض",
    "اختبارات تمريض",
    "امتحانات تمريض",
    "تمريض طوارئ",
    "GAITH TEAM",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "GAITH TEAM",
    title: "GAITH TEAM - الامتحان في جيبك",
    description:
      "اختبارات تمريض إلكترونية بجميع الفرق والتخصصات مع نظام أمان وكاميرات.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GAITH TEAM - منصة اختبارات التمريض",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GAITH TEAM - الامتحان في جيبك",
    description: "اختبارات تمريض إلكترونية بجميع الفرق والتخصصات.",
    images: ["/logo.png"],
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("gaithTheme")?.value as
    | "light"
    | "dark"
    | undefined;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${cairo.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider initialTheme={savedTheme}>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
