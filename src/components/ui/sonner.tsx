"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";
const Toaster = ({ ...props }: ToasterProps) => {
  // Use dark theme by default for JARVIS System
  // Removed next-themes dependency to prevent mounting issues
  // Explicitly set theme prop to avoid any subscription attempts
  try {
    return (
      <Sonner
        theme="dark"
        className="toaster group"
        style={
          {
            "--normal-bg": "rgba(17, 25, 40, 0.95)",
            "--normal-text": "#22d3ee",
            "--normal-border": "rgba(34, 211, 238, 0.3)",
          } as React.CSSProperties
        }
        {...props}
      />
    );
  } catch (error: any) {
    console.error('Sonner error:', error);
    return null;
  }
};

export { Toaster };
