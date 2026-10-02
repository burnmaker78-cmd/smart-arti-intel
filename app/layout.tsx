import type { Metadata } from "next";
import "./globals.css"; // Ensure standard Tailwind CSS is loaded

export const metadata: Metadata = {
  title: "Smart AI Chat",
  description: "AI app with file linking features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
