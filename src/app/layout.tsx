import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Training Platform",
  description: "Plateforme d'entrainement aux techniques de vente par simulation IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
