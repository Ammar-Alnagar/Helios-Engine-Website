import { useRef, type ReactNode } from 'react';
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
