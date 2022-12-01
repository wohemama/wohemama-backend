import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="zh-CN" className="h-full bg-gray-50">

      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
