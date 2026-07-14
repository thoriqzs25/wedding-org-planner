"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const handleScroll = () => setShow(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [show]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const getTooltipStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;
    const tipWidth = Math.min(224, vw * 0.8);

    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      pointerEvents: "none",
      maxWidth: "80vw",
      width: tipWidth,
    };

    if (position === "top") {
      styles.top = rect.top - gap;
      styles.left = clamp(rect.left + rect.width / 2, tipWidth / 2 + 4, vw - tipWidth / 2 - 4);
      styles.transform = "translate(-50%, -100%)";
    } else if (position === "bottom") {
      styles.top = rect.bottom + gap;
      styles.left = clamp(rect.left + rect.width / 2, tipWidth / 2 + 4, vw - tipWidth / 2 - 4);
      styles.transform = "translateX(-50%)";
    } else if (position === "left") {
      styles.top = clamp(rect.top + rect.height / 2, vh * 0.15, vh * 0.85);
      styles.left = Math.max(gap, rect.left - gap);
      styles.transform = "translate(-100%, -50%)";
    } else {
      styles.top = clamp(rect.top + rect.height / 2, vh * 0.15, vh * 0.85);
      styles.left = Math.min(vw - gap, rect.right + gap);
      styles.transform = "translateY(-50%)";
    }
    return styles;
  };

  const getArrowStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 8,
      height: 8,
      backgroundColor: "#6B4C2A",
    };
    if (position === "top") {
      base.top = "100%";
      base.left = "50%";
      base.transform = "translateX(-50%) translateY(-50%) rotate(45deg)";
    } else if (position === "bottom") {
      base.bottom = "100%";
      base.left = "50%";
      base.transform = "translateX(-50%) translateY(50%) rotate(45deg)";
    } else if (position === "left") {
      base.left = "100%";
      base.top = "50%";
      base.transform = "translateY(-50%) translateX(-50%) rotate(45deg)";
    } else {
      base.right = "100%";
      base.top = "50%";
      base.transform = "translateY(-50%) translateX(50%) rotate(45deg)";
    }
    return base;
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.stopPropagation(); setShow(!show); }}
    >
      {children}
      {show && typeof document !== "undefined" && createPortal(
        <div ref={tooltipRef} style={{ ...getTooltipStyle() }}>
          <div className="bg-amber-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg w-full text-center">
            {content}
            <div style={getArrowStyle()} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
