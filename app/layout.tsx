import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "机场导航站 - 低价与高性价比机场推荐",
  description: "精选低价与高性价比机场服务，按价格、流量、速度、线路类型分类整理，帮你快速找到合适的选择。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        <script
          src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          async
        />
      </body>
    </html>
  );
}
