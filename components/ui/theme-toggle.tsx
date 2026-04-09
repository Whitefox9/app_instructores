"use client";

import { useState } from "react";
import { SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => resolveTheme());

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      <SunMoon className="h-4 w-4" />
    </Button>
  );
}
