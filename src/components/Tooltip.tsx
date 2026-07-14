"use client";

import { ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const getTooltipStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();
    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      pointerEvents: "none",
    };
    if (position === "top") {
      styles.top = rect.top - 8;
      styles.left = rect.left + rect.width / 2;
      styles.transform = "translate(-50%, -100%)";
    } else if (position === "bottom") {
      styles.top = rect.bottom + 8;
      styles.left = rect.left + rect.width / 2;
      styles.transform = "translateX(-50%)";
    } else if (position === "left") {
      styles.top = rect.top + rect.height / 2;
      styles.left = rect.left - 8;
      styles.transform = "translate(-100%, -50%)";
    } else {
      styles.top = rect.top + rect.height / 2;
      styles.left = rect.right + 8;
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
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      {children}
      {show && typeof document !== "undefined" && createPortal(
        <div style={{ ...getTooltipStyle() }}>
          <div className="bg-amber-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg w-56 text-center">
            {content}
            <div style={getArrowStyle()} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
