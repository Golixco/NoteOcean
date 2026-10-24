"use client";

import React from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export type SaveState = "saved" | "saving" | "error";

interface SaveStatusProps {
  status: SaveState;
}

export function SaveStatus({ status }: SaveStatusProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-200">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10161f]/90 border border-white/[0.08] backdrop-blur-sm shadow-md text-xs text-[#8e9fac]">
        {status === "saving" && (
          <>
            <Loader2 className="w-3.5 h-3.5 text-[#2dd4bf] animate-spin" />
            <span>Saving changes...</span>
          </>
        )}
        {status === "saved" && (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>All changes saved</span>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-300">Storage full or error</span>
          </>
        )}
      </div>
    </div>
  );
}
