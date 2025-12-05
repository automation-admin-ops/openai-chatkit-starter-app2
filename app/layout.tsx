export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <script async src="https://cdn.openai.com/chatkit/v1/chatkit.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
