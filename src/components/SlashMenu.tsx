"use client";

import React, { useEffect, useState } from "react";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  CheckSquare,
  Quote,
  Minus,
  CornerDownLeft,
} from "lucide-react";

export interface SlashItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  keywords: string[];
  action: () => void;
}

interface SlashMenuProps {
  query: string;
  position: { top: number; left: number };
  onClose: () => void;
  items: SlashItem[];
}

export function SlashMenu({ query, position, onClose, items }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items matching query
  const filtered = items.filter((item) => {
    const q = query.toLowerCase().replace(/^\//, "").trim();
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filtered.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [filtered, selectedIndex, onClose]);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      className="fixed z-50 w-64 bg-[#151c24] border border-white/[0.1] rounded-[10px] shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Header filter display matching reference: "Q /code" */}
      <div className="px-3 py-1 text-[11px] font-medium text-slate-400 border-b border-white/[0.06] mb-1 flex items-center gap-1.5">
        <span className="text-teal-400 font-bold">Q</span>
        <span className="text-slate-300">/{query.replace(/^\//, "")}</span>
      </div>

      <div className="max-h-60 overflow-y-auto px-1 space-y-0.5">
        {filtered.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs text-left transition-colors ${
                isSelected
                  ? "bg-[#16383a] border border-[#14b8a6] text-[#f8fafc] font-medium"
                  : "text-[#cbd5e1] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "text-[#2dd4bf]" : "text-slate-400"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="truncate">
                  <div className="text-xs">{item.title}</div>
                </div>
              </div>

              {isSelected && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pl-2">
                  <CornerDownLeft className="w-3 h-3 text-[#2dd4bf]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
