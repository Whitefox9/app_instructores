import type { Metadata } from "next";
import type { CSSProperties } from "react";

import "@/app/globals.css";

const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : prefersDark
        ? "dark"
        : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export const metadata: Metadata = {
  title: "Gestor de Instructores",
  description: "Base SaaS para la gestion institucional de instructores, fichas y asignaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        style={
          {
            "--font-sans": '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
            "--font-display": '"Georgia", "Times New Roman", serif',
          } as CSSProperties
        }
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="sena-top-strip h-2 w-full" />
        {children}
      </body>
    </html>
  );
}
