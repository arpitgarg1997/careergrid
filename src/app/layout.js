import "./globals.css";

export const metadata = {
  title: "Career Guidance After 10th in India | CareerGrid",
  description:
    "Take India's structured career guidance quiz to discover the right career path after 10th. Free, fast, and personalised for Class 9-12 students.",
  keywords:
    "career guidance after 10th, stream selection India, career counselling India, career quiz India, career planning for students, best career options after 10th",
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
