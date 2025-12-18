import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="h-full">
      <body className="h-full min-h-screen">
        {children}
      </body>
    </html>
  );
}
