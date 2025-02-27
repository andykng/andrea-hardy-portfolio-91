
import { useState, useEffect } from "react";

/**
 * Hook pour détecter si un media query est satisfait
 * @param {string} query - Le media query à vérifier
 * @returns {boolean} True si le media query est satisfait
 */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set matches value
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Initial check
    updateMatches();
    
    // Add listener
    media.addEventListener('change', updateMatches);
    
    // Cleanup
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}

/**
 * Hook pour détecter si l'appareil est de type mobile
 * @returns {boolean} True si c'est un mobile
 */
export function useMobile(): boolean {
  return useMedia('(max-width: 768px)');
}
