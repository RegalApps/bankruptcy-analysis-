
import React, { createContext, useContext, useEffect } from "react";

interface HotkeysContextValue {
  registerHotkey: (key: string, callback: () => void) => void;
  unregisterHotkey: (key: string) => void;
}

const HotkeysContext = createContext<HotkeysContextValue | undefined>(undefined);

export const HotkeysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hotkeys = new Map<string, () => void>();
  
  const registerHotkey = (key: string, callback: () => void) => {
    hotkeys.set(key.toLowerCase(), callback);
  };
  
  const unregisterHotkey = (key: string) => {
    hotkeys.delete(key.toLowerCase());
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contentEditable element
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }
      
      const key = event.key.toLowerCase();
      const callback = hotkeys.get(key);
      
      if (callback) {
        event.preventDefault();
        callback();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  return (
    <HotkeysContext.Provider value={{ registerHotkey, unregisterHotkey }}>
      {children}
    </HotkeysContext.Provider>
  );
};

export const useHotkeys = (key: string, callback: () => void, deps: React.DependencyList = []) => {
  const context = useContext(HotkeysContext);
  
  if (!context) {
    throw new Error("useHotkeys must be used within a HotkeysProvider");
  }
  
  useEffect(() => {
    context.registerHotkey(key, callback);
    return () => context.unregisterHotkey(key);
  }, [key, callback, context, ...deps]);
};
