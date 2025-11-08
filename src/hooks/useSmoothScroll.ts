import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const useSmoothScroll = () => {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    let lastScrollY = window.scrollY;

    const sections = document.querySelectorAll('[data-scroll-section]');
    
    const snapToSection = (section: Element) => {
      if (isScrolling) return;
      
      isScrolling = true;
      const sectionTop = (section as HTMLElement).offsetTop;
      
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: sectionTop, autoKill: false },
        ease: 'power2.inOut',
        onComplete: () => {
          isScrolling = false;
        }
      });
    };

    const findClosestSection = () => {
      const scrollPos = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollDirection = scrollPos > lastScrollY ? 'down' : 'up';
      lastScrollY = scrollPos;

      let closestSection: Element | null = null;
      let smallestDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionMiddle = rect.top + rect.height / 2;
        
        // Calculate distance from viewport center
        const distance = Math.abs(sectionMiddle - viewportHeight / 2);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestSection = section;
        }
      });

      return closestSection;
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        if (isScrolling) return;
        
        const closestSection = findClosestSection();
        
        if (closestSection) {
          const rect = closestSection.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const sectionMiddle = rect.top + rect.height / 2;
          const distanceFromCenter = Math.abs(sectionMiddle - viewportHeight / 2);
          
          // Only snap if not already well-centered
          if (distanceFromCenter > 100) {
            snapToSection(closestSection);
          }
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
};
