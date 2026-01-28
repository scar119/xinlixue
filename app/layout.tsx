import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "心语AI - 用简单心理学与AI工具带来幸福",
  description: "激发内在力量，成为更好的自己。专业的AI心理工具平台，提供夸夸AI、心理测试、理论知识等多元化互动体验。",
  keywords: "心理学,AI,心理测试,情绪支持,自我提升",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        {/* TweakCN 实时预览 */}
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
