// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Escolha os pesos que deseja usar
  variable: '--font-montserrat', // Opcional: útil para Tailwind CSS
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projeto Televisão",
  description: "Nosso projeto para televisões do Senai",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{
        fontFamily: ""
      }}
    >
      {/* <body  className={montserrat.className}> */}
        <div className="min-h-full flex flex-col ">
        {children}
        </div>
      {/* </body> */}
    </html>
  );
}