
import { useEffect, ReactNode, createContext, useContext } from 'react';

interface HotkeysProviderProps {
  children: ReactNode;
}

interface HotkeysContextType {
  // The context is just a wrapper for the provider to work
}

const HotkeysContext = createContext<HotkeysContextType>({});

export function HotkeysProvider({ children }: HotkeysProviderProps) {
  return (
    <HotkeysContext.Provider value={{}}>
      {children}
    </HotkeysContext.Provider>
  );
}

export function useHotkeys(
  keys: string,
  callback: () => void,
  dependencies: any[] = []
) {
  const keyArray = keys.toLowerCase().split('+');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();
      
      // Check if all required keys are pressed
      const shiftRequired = keyArray.includes('shift');
      const ctrlRequired = keyArray.includes('ctrl');
      const altRequired = keyArray.includes('alt');
      const metaRequired = keyArray.includes('meta');
      
      const mainKey = keyArray.filter(
        k => !['shift', 'ctrl', 'alt', 'meta'].includes(k)
      )[0];
      
      if (
        pressedKey === mainKey &&
        event.shiftKey === shiftRequired &&
        event.ctrlKey === ctrlRequired &&
        event.altKey === altRequired &&
        event.metaKey === metaRequired
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
}
