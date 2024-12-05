import { useState, useEffect } from "react";

/**
 * Custom hook to determine if the viewport matches a mobile breakpoint.
 * By default, it checks for a max-width of 768px.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = () => setIsMobile(mediaQuery.matches);

    // Add listener for changes in the media query
    mediaQuery.addEventListener("change", handleChange);

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
}
