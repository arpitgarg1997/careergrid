import "./globals.css";

export const metadata = {
  title: "Career Guidance After 10th in India | CareerGrid",
  description:
    "Take India's structured career guidance quiz to discover the right career path after 10th. Free, fast, and personalised for Class 9-12 students.",
  keywords:
    "career guidance after 10th, stream selection India, career counselling India, career quiz India, career planning for students, best career options after 10th",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Career Guidance After 10th in India | CareerGrid",
    description:
      "Discover your ideal career direction with India's structured career quiz. Free for Class 9-12 students.",
    url: "https://careergrid.in",
    siteName: "CareerGrid",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Guidance After 10th in India | CareerGrid",
    description:
      "Discover your ideal career direction with India's structured career quiz.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">{children}</body>
    </html>
  );
}
