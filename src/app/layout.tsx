import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactQueryProvider from "../../utils/provider";
import styles from "../../assets/styles/styles.module.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Heroes App",
  description: "Dota Heroes List App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.container}>
        <ReactQueryProvider>
          <main>{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
