"use client";

import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

export default function WavyText({ children, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      const { chars } = splitText(containerRef.current.querySelector(".wavy"));
      containerRef.current.style.visibility = "visible";

      const staggerDelay = 0.15;

      animate(
        chars,
        { y: [-20, 20] },
        {
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          duration: 2,
          delay: stagger(staggerDelay, {
            startDelay: -staggerDelay * chars.length,
          }),
        }
      );
    });
  }, []);

  return (
    <div
      className={`w-full flex justify-center items-center ${className}`}
      ref={containerRef}
    >
      <h1 className="text-xl md:text-3xl font-semibold wavy">{children}</h1>
      <style>{`
        .wavy .split-char {
          will-change: transform, opacity;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
