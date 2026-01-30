"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";
import { useEffect } from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sonner.tsx:8',message:'Toaster component mounting',data:{hasSonner:typeof Sonner !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  }, []);
  // #endregion
  
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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sonner.tsx:25',message:'Error rendering Sonner',data:{error:error?.message,stack:error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.error('Sonner error:', error);
    return null;
  }
};

export { Toaster };
