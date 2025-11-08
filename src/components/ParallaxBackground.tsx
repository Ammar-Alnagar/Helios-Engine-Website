import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main gradient background - slowly shifts hue and scale
      gsap.to(gradientRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        filter: 'hue-rotate(60deg)',
        scale: 1.2,
        ease: 'none',
      });

      // Layer 1 - Slowest parallax (deepest)
      gsap.to(layer1Ref.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
        y: '30%',
        scale: 1.1,
        ease: 'none',
      });

      // Layer 2 - Medium parallax
      gsap.to(layer2Ref.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
        y: '50%',
        scale: 1.15,
        rotation: 5,
        ease: 'none',
      });

      // Layer 3 - Fastest parallax (closest)
      gsap.to(layer3Ref.current, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        y: '70%',
        scale: 1.2,
        rotation: -3,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Main gradient background */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        style={{ willChange: 'transform, filter' }}
      />

      {/* Layer 1 - Deepest layer with large circles */}
      <div
        ref={layer1Ref}
        className="absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-orange-400/20 dark:from-orange-600/10 dark:to-orange-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-blue-400/20 dark:from-blue-600/10 dark:to-blue-400/5 rounded-full blur-3xl" />
      </div>

      {/* Layer 2 - Middle layer with medium shapes */}
      <div
        ref={layer2Ref}
        className="absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-gradient-to-br from-purple-200/40 to-purple-400/30 dark:from-purple-600/15 dark:to-purple-400/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[30%] left-[20%] w-[350px] h-[350px] bg-gradient-to-br from-pink-200/40 to-pink-400/30 dark:from-pink-600/15 dark:to-pink-400/10 rounded-full blur-2xl" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-cyan-200/30 to-cyan-400/20 dark:from-cyan-600/10 dark:to-cyan-400/5 rounded-full blur-2xl" />
      </div>

      {/* Layer 3 - Closest layer with small accents */}
      <div
        ref={layer3Ref}
        className="absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-[15%] left-[25%] w-[200px] h-[200px] bg-gradient-to-br from-orange-300/50 to-orange-500/40 dark:from-orange-500/20 dark:to-orange-300/15 rounded-full blur-xl" />
        <div className="absolute top-[60%] right-[30%] w-[250px] h-[250px] bg-gradient-to-br from-blue-300/50 to-blue-500/40 dark:from-blue-500/20 dark:to-blue-300/15 rounded-full blur-xl" />
        <div className="absolute bottom-[15%] left-[40%] w-[180px] h-[180px] bg-gradient-to-br from-purple-300/50 to-purple-500/40 dark:from-purple-500/20 dark:to-purple-300/15 rounded-full blur-xl" />
      </div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-gray-900/50" />
    </div>
  );
};

export default ParallaxBackground;
