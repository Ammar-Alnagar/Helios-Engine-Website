import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const ScrollSection = ({ children, className = '', id }: ScrollSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Fade in and move up as section enters viewport
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.5,
            toggleActions: 'play none none reverse',
          },
          ease: 'power2.out',
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-scroll-section
      className={`min-h-screen flex items-center justify-center ${className}`}
      style={{ 
        willChange: 'opacity, transform',
        position: 'relative'
      }}
    >
      {children}
    </section>
  );
};

export default ScrollSection;
