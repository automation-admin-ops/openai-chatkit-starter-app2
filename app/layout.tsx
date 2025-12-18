import "./globals.css";
import { ChatKitProvider } from "@openai/chatkit-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="h-screen w-screen overflow-hidden">
        <ChatKitProvider>
          {children}
        </ChatKitProvider>
      </body>
    </html>
  );
}
