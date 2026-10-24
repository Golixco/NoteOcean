"use client";

import React, { useEffect, useRef } from "react";
import {
  Search,
  Plus,
  FileText,
  Home,
  Star,
  Trash2,
  Settings,
  ChevronDown,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { NotePage } from "@/types/note";
import { WaveLogo } from "./Icons";

interface SidebarProps {
  pages: NotePage[];
  activePageId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPage: (id: string) => void;
  onNewPage: () => void;
  onDeletePage: (id: string, e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  pages,
  activePageId,
  searchQuery,
  onSearchChange,
  onSelectPage,
  onNewPage,
  onDeletePage,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredPages = pages.filter((page) =>
    (page.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`h-screen bg-[#0f141c] border-r border-white/[0.07] flex flex-col flex-shrink-0 transition-all duration-200 select-none ${
        isCollapsed ? "w-0 overflow-hidden border-none" : "w-[250px]"
      }`}
    >
      {/* Top Header / Branding */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <WaveLogo className="w-5 h-5" />
          <span className="font-bold text-base tracking-tight text-[#f8fafc]">NoteOcean</span>
        </div>
        <button
          onClick={onToggleCollapse}
          title="Collapse sidebar"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input matching reference */}
      <div className="px-3 py-2">
        <div className="relative flex items-center bg-[#181f28] rounded-md border border-white/[0.08] focus-within:border-[#14b8a6] transition-colors">
          <Search className="w-3.5 h-3.5 ml-2.5 text-slate-400 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your pages"
            className="w-full bg-transparent px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="mr-2 text-[10px] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          ) : (
            <span className="mr-2 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-800 rounded border border-white/[0.06]">
              Ctrl K
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {/* Workspace Group */}
        <div>
          <div className="px-2 pb-1.5 text-[11px] font-semibold text-[#64748b] tracking-wider uppercase">
            Workspace
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => pages[0] && onSelectPage(pages[0].id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#cbd5e1] hover:text-white hover:bg-slate-800/40 transition-colors text-left"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Home</span>
            </button>
            <button
              onClick={onNewPage}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#cbd5e1] hover:text-white hover:bg-slate-800/40 transition-colors text-left"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Quick notes</span>
            </button>
            <button
              onClick={() => {}}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-[#cbd5e1] hover:text-white hover:bg-slate-800/40 transition-colors text-left"
            >
              <Star className="w-3.5 h-3.5 text-slate-400" />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Your Pages Group */}
        <div>
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-[11px] font-semibold text-[#64748b] tracking-wider uppercase">
              Your Pages
            </span>
            <button
              onClick={onNewPage}
              title="Create new page"
              className="p-1 rounded text-slate-400 hover:text-teal-400 hover:bg-slate-800/60 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {filteredPages.length === 0 ? (
              <div className="px-2.5 py-3 text-xs text-slate-500 italic text-center">
                {searchQuery ? "No matching pages found" : "No pages yet"}
              </div>
            ) : (
              filteredPages.map((page) => {
                const isActive = page.id === activePageId;
                return (
                  <div
                    key={page.id}
                    onClick={() => onSelectPage(page.id)}
                    className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#162a2d] border border-[#14b8a6] text-[#f8fafc] font-medium shadow-sm"
                        : "text-[#cbd5e1] hover:text-white hover:bg-slate-800/40 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? "text-[#2dd4bf]" : "text-slate-400 group-hover:text-slate-300"
                        }`}
                      />
                      <span className="truncate">{page.title || "Untitled"}</span>
                    </div>

                    {/* Delete action on hover */}
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => onDeletePage(page.id, e)}
                        title="Delete page"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Profile Bar matching reference */}
      <div className="px-3 py-3 border-t border-white/[0.07] flex items-center justify-between bg-[#0f141c]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-400 flex items-center justify-center text-white font-semibold text-xs shadow">
            G
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xs font-medium text-[#f8fafc]">Golixco</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
        <button
          title="Settings"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
