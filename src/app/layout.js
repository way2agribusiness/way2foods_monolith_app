import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/userContext";
import Headers from "@/Components/header";
import Footer from "@/Components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Way2Foods",
  description: "One place solution for all your needs",
  icons: {
    icon: "/favicon.ico", // Correct path
  }
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Headers />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}
