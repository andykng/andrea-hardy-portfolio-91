
import { useEffect } from "react";

export const BotpressChat = () => {
  useEffect(() => {
    // This is just to ensure Botpress is properly initialized
    const checkBotpress = () => {
      if (window && 'botpressWebChat' in window) {
        console.log("Botpress webchat is loaded");
      } else {
        // If not loaded yet, try again
        setTimeout(checkBotpress, 500);
      }
    };

    checkBotpress();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null; // This component doesn't render anything visual itself
};
