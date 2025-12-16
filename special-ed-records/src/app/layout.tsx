import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "특수교육 누가기록 시스템",
  description: "특수교육 학생의 누가기록을 자동으로 생성하고 관리하는 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
