"use client";

import React, { useState } from "react";
import {
  FileText,
  Star,
  Share2,
  MoreHorizontal,
  Mic,
  MicOff,
  Menu,
  Download,
  Trash2,
  Plus,
} from "lucide-react";

interface HeaderBarProps {
  pageTitle: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onNewPage: () => void;
  onDeleteCurrentPage: () => void;
  onExportMarkdown: () => void;
  isListening?: boolean;
  onToggleDictation?: () => void;
  dictationSupported?: boolean;
}

export function HeaderBar({
  pageTitle,
  isSidebarCollapsed,
  onToggleSidebar,
  onNewPage,
  onDeleteCurrentPage,
  onExportMarkdown,
  isListening = false,
  onToggleDictation,
  dictationSupported = true,
}: HeaderBarProps) {
  const [isStarFilled, setIsStarFilled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  return (
    <header className="h-12 border-b border-white/[0.07] px-4 flex items-center justify-between bg-[#0d1117] flex-shrink-0 z-20">
      {/* Breadcrumbs matching reference */}
      <div className="flex items-center gap-2 text-xs truncate">
        {isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            title="Expand sidebar"
            className="p-1.5 mr-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <FileText className="w-3.5 h-3.5 text-[#2dd4bf] flex-shrink-0" />
          <span className="hover:text-slate-300 cursor-pointer">NoteOcean</span>
          <span className="text-slate-600">/</span>
          <span className="text-[#f8fafc] font-medium truncate max-w-[280px]">
            {pageTitle || "Untitled"}
          </span>
        </div>
      </div>

      {/* Right Action Utilities */}
      <div className="flex items-center gap-1">
        {/* Optional Speech-to-Text Button */}
        {onToggleDictation && (
          <button
            onClick={onToggleDictation}
            title={
              !dictationSupported
                ? "Speech recognition requires a Chromium browser (Chrome/Edge)"
                : isListening
                ? "Stop voice dictation"
                : "Start voice dictation (Web Speech API)"
            }
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
              isListening
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                : "text-slate-400 hover:text-teal-400 hover:bg-slate-800/60"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium hidden sm:inline">Listening...</span>
              </>
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Favorite Star */}
        <button
          onClick={() => setIsStarFilled(!isStarFilled)}
          title="Add to favorites"
          className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
        >
          <Star className={`w-3.5 h-3.5 ${isStarFilled ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Copy link to clipboard"
          className="p-1.5 px-2.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-1.5 transition-colors border border-white/[0.08]"
        >
          <Share2 className="w-3 h-3 text-slate-400" />
          <span className="hidden sm:inline">{shareFeedback ? "Copied!" : "Share"}</span>
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Page options"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-[#151c24] border border-white/[0.1] rounded-lg shadow-xl py-1 z-40 text-xs">
                <button
                  onClick={() => {
                    onNewPage();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[#cbd5e1] hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span>New Page</span>
                </button>
                <button
                  onClick={() => {
                    onExportMarkdown();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[#cbd5e1] hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export as Markdown</span>
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    onDeleteCurrentPage();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Page</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
