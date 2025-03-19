
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

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
 * @param options - Animation options
 */
export const revealTextOnScroll = (
  element: string | Element,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
  }
) => {
  const defaults = {
    y: 100,
    stagger: 0.02,
    duration: 0.7,
    start: "top 80%"
  };
  const config = { ...defaults, ...options };
  
  // Instead of using SplitText, we'll manually split the text if it's an element
  const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
  if (!targetElement) return;
  
  // Create wrapper spans for each character
  if (targetElement instanceof HTMLElement) {
    const text = targetElement.innerText;
    targetElement.innerHTML = '';
    
    // Create a wrapper for all characters
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    
    // Create spans for each character
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = char;
      wrapper.appendChild(span);
      return span;
    });
    
    targetElement.appendChild(wrapper);
    
    // Animate each character span
    gsap.set(chars, { y: config.y, opacity: 0 });
    
    return gsap.to(chars, {
      y: 0,
      opacity: 1,
      stagger: config.stagger,
      duration: config.duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: targetElement,
        start: config.start,
        toggleActions: "play none none reverse"
      }
    });
  }
  
  // If not an element, fallback to simple opacity animation
  return gsap.fromTo(element, 
    { y: config.y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: config.duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: config.start,
        toggleActions: "play none none reverse"
      }
    }
  );
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

/**
 * Animate skill bars
 * @param element - The element containing skill bars
 */
export const animateSkillBars = (element: string | Element) => {
  const skillBars = document.querySelectorAll(`${element} .skill-bar`);
  
  skillBars.forEach((bar) => {
    const level = bar.getAttribute('data-level') || "0";
    
    gsap.set(bar, { width: 0 });
    
    ScrollTrigger.create({
      trigger: bar,
      start: "top 90%",
      onEnter: () => {
        gsap.to(bar, {
          width: `${level}%`,
          duration: 1.5,
          ease: "power2.out"
        });
      },
      once: true
    });
  });
};

/**
 * Animate elements on page load with a staggered effect
 * @param elements - Array of elements to animate
 */
export const staggeredPageLoad = (elements: string[]) => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
  elements.forEach((el, index) => {
    tl.fromTo(
      el,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1 },
      index === 0 ? "+=0.2" : "-=0.3"
    );
  });
  
  return tl;
};

/**
 * Animate elements on scroll with a fade-in effect
 * @param elements - Array of elements or selectors
 */
export const fadeInOnScroll = (elements: (string | Element)[]) => {
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};
