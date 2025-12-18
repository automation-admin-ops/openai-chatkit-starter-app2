import "@openai/chatkit-react/styles.css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="h-screen w-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
