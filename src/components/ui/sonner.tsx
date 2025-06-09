"use client";

import { useTheme } from "next-themes";
import * as SonnerLib from "sonner";
import type { ToasterProps } from "sonner";

const Sonner = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerLib.Toaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

// Re-export everything from sonner, overriding Toaster with our custom Sonner
export * from "sonner";
export { Sonner };
