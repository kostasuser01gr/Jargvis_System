import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
// Fix for cmdk trying to subscribe to next-themes
// Provide a module-level mock before any imports that might use it
if (typeof window !== 'undefined') {
  // Mock next-themes at the module level to prevent cmdk subscribe errors
  const mockThemeProvider = {
    subscribe: (callback: () => void) => {
      // Return a no-op unsubscribe function
      return () => {};
    },
    get: () => ({ theme: 'dark', resolvedTheme: 'dark' }),
    set: () => {},
  };
  
  // Store in window for cmdk to access if needed
  (window as any).__nextThemes = mockThemeProvider;
  fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:6',message:'Created next-themes mock in main.tsx',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
}
// #endregion

  // Error handling for React mounting
  // #region agent log
  // Global error handler before React mounts
  window.addEventListener('error', (event) => {
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:6',message:'Pre-React error caught',data:{error:event.error?.message,stack:event.error?.stack,filename:event.filename,lineno:event.lineno},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  });
  window.addEventListener('unhandledrejection', (event) => {
    fetch('http://127.0.0.1:7244/ingest/7769055a-33e5-41ee-95ff-da63c73d21b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:10',message:'Pre-React unhandled rejection',data:{reason:event.reason?.message,stack:event.reason?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  });
  // #endregion
  
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    // Remove fallback loading screen
    const fallback = rootElement.querySelector('div[style*="position: fixed"]');
    if (fallback) {
      fallback.remove();
    }

    const root = createRoot(rootElement);
    root.render(<App />);

    // Log success
    console.log("✅ JARVIS System mounted successfully");
  } catch (error) {
  console.error("❌ Failed to mount JARVIS System:", error);
  
  // Show error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="position: fixed; inset: 0; background: black; display: flex; align-items: center; justify-content: center; color: #ef4444; font-family: monospace; padding: 20px; text-align: center;">
        <div>
          <h1 style="font-size: 24px; margin-bottom: 16px;">JARVIS System Error</h1>
          <p style="font-size: 14px; margin-bottom: 8px;">Failed to initialize:</p>
          <p style="font-size: 12px; color: #f87171;">${error instanceof Error ? error.message : String(error)}</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload
          </button>
        </div>
      </div>
    `;
  }
}
