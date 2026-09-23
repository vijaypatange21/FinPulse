import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function AnimatedCounter({
  end = 100,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const obj = { val: 0 };
          gsap.to(obj, {
            val: end,
            duration,
            ease: 'power3.out',
            onUpdate: () => {
              setValue(obj.val);
            }
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value);

  return (
    <span ref={elementRef} className={`tabular-nums font-display ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
