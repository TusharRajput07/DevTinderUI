"use client";

import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

export default function SplitText({ children, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;
      containerRef.current.style.visibility = "visible";

      const { words } = splitText(
        containerRef.current.querySelector(".split-text")
      );

      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 2,
          bounce: 0,
          delay: stagger(0.05),
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} style={{ visibility: "hidden" }}>
      <h1 className={`split-text ${className}`}>{children}</h1>
      <style>{`
        .split-word {
          will-change: transform, opacity;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
