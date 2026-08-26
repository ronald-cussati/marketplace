import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/carrinho/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FeiraLocal — Marketplace Digital de Produtores e Artesãos",
  description:
    "Compre produtos agroecológicos frescos, queijos da serra, pães artesanais e artesanato diretamente de pequenos produtores locais.",
  keywords: [
    "marketplace local",
    "feira de produtores",
    "artesanato",
    "agricultura familiar",
    "produtos organicos",
    "queijo artesanal",
    "mel puro",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-[#fcfbfa] text-slate-900 selection:bg-primary-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
