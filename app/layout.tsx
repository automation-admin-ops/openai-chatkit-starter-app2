import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        {/* WYMAGANE przez ChatKit (web component) */}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
