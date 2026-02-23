import type { Metadata } from "next";
import "./globals.css";
import { themeCssVariables } from "@/lib/themeCssVariables";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Stack Capital",
  description: "Stack Capital investment dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={themeCssVariables}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
