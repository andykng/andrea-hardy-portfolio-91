
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

/**
 * Animate text with a typewriter effect
 * @param element - The element to animate
 * @param options - Animation options
 */
export const typewriterAnimation = (
  element: string | Element, 
  options?: { 
    duration?: number; 
    delay?: number; 
    text?: string; 
    ease?: string;
  }
) => {
  const defaults = { 
    duration: 1, 
    delay: 0.2, 
    ease: "power1.inOut" 
  };
  const config = { ...defaults, ...options };
  
  return gsap.to(element, {
    duration: config.duration,
    text: options?.text || { value: "" },
    delay: config.delay,
    ease: config.ease,
  });
};

/**
 * Reveal text on scroll
 * @param element - The element to animate
 */
export const revealTextOnScroll = (element: string | Element) => {
  const splitText = new SplitText(element, { type: "words,chars" });
  const chars = splitText.chars;

  gsap.set(chars, { y: 100, opacity: 0 });
  
  return gsap.to(chars, {
    y: 0,
    opacity: 1,
    stagger: 0.02,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
};

/**
 * Animate a hero section with staggered elements
 * @param container - The container element
 * @param elements - Elements to animate in sequence
 */
export const animateHeroSection = (container: string, elements: string[]) => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
  tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  
  elements.forEach((el, index) => {
    tl.fromTo(
      el, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1 }, 
      "-=0.4"
    );
  });
  
  return tl;
};

/**
 * Create a smooth scroll effect for sections
 * @param trigger - The trigger element
 * @param target - The target element to scroll to
 */
export const smoothScrollTo = (trigger: string, target: string) => {
  const triggers = document.querySelectorAll(trigger);
  
  triggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.querySelector(target);
      
      if (targetEl) {
        gsap.to(window, {
          duration: 1, 
          scrollTo: { y: targetEl, offsetY: 50 },
          ease: "power2.inOut"
        });
      }
    });
  });
};
