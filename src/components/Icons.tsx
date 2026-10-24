import React from "react";

export function WaveLogo({ className = "w-6 h-6", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center ${glow ? "glow-cyan" : ""}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-[#2dd4bf] ${className}`}
      >
        <path d="M2 12c2.5-3 5.5-3 8 0s5.5 3 8 0 4-2 4-2" />
        <path d="M2 17c2.5-3 5.5-3 8 0s5.5 3 8 0 4-2 4-2" opacity="0.6" />
        <circle cx="19" cy="6" r="1.5" fill="#2dd4bf" stroke="none" />
      </svg>
    </div>
  );
}

export function DragHandleIcon({ className = "w-4 h-4 text-slate-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="8" cy="6" r="1.5" />
      <circle cx="16" cy="6" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </svg>
  );
}
