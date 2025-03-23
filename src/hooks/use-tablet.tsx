
import * as React from "react"

// Define breakpoints - tablet is between mobile and desktop
const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT)
    }
    
    // Initial check
    checkIfTablet()
    
    // Add event listener
    window.addEventListener("resize", checkIfTablet)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfTablet)
  }, [])

  return isTablet
}
