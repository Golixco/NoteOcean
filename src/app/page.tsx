"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { HeaderBar } from "@/components/HeaderBar";
import { Editor } from "@/components/Editor";
import { SaveStatus, SaveState } from "@/components/SaveStatus";
import { AIBotDrawer } from "@/components/AIBotDrawer";
import { NotePage } from "@/types/note";
import { SAMPLE_NOTES } from "@/lib/sample-notes";

const STORAGE_KEY_PAGES = "noteocean_pages";
const STORAGE_KEY_ACTIVE = "noteocean_active_page_id";

export default function NoteOceanApp() {
  const [pages, setPages] = useState<NotePage[]>([]);
  const [activePageId, setActivePageId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveState>("saved");
  const [isMounted, setIsMounted] = useState(false);

  // Web Speech API dictation state
  const [isListening, setIsListening] = useState(false);
  const [dictationSupported, setDictationSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const activeEditorRef = useRef<any>(null);

  // 1. Initial Load & Seed Notes into localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedPages = localStorage.getItem(STORAGE_KEY_PAGES);
      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE);

      if (storedPages) {
        const parsed = JSON.parse(storedPages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPages(parsed);
          const initialActive =
            storedActiveId && parsed.some((p: NotePage) => p.id === storedActiveId)
              ? storedActiveId
              : parsed[0].id;
          setActivePageId(initialActive);
          return;
        }
      }

      // No stored notes: seed sample notes matching UI reference
      setPages(SAMPLE_NOTES);
      setActivePageId(SAMPLE_NOTES[0].id);
      localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(SAMPLE_NOTES));
      localStorage.setItem(STORAGE_KEY_ACTIVE, SAMPLE_NOTES[0].id);
    } catch (err) {
      console.error("Failed to load notes from localStorage:", err);
      setPages(SAMPLE_NOTES);
      setActivePageId(SAMPLE_NOTES[0].id);
    }
  }, []);

  // 2. Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          if (activeEditorRef.current) {
            activeEditorRef.current.commands.insertContent(transcript + " ");
          }
        };

        rec.onerror = (e: any) => {
          console.warn("Speech recognition error:", e.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } else {
        setDictationSupported(false);
      }
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // 3. Page Selection
  const handleSelectPage = (id: string) => {
    setActivePageId(id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, id);
    } catch (err) {
      console.error("Failed to persist active page ID:", err);
    }
  };

  // 4. Create New Page
  const handleNewPage = () => {
    const newId = "note-" + Date.now();
    const newPage: NotePage = {
      id: newId,
      title: "Untitled",
      icon: "📄",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plainText: "",
      content: {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
    };

    const updated = [newPage, ...pages];
    setPages(updated);
    setActivePageId(newId);

    try {
      localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_ACTIVE, newId);
    } catch (err) {
      console.error("Storage error creating page:", err);
      setSaveStatus("error");
    }
  };

  // 5. Update Page (debounced from Editor)
  const handleUpdatePage = (id: string, updates: Partial<NotePage>) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(nextPages));
      } catch (err) {
        console.error("Storage error saving note:", err);
        setSaveStatus("error");
      }
      return nextPages;
    });
  };

  // 6. Delete Page
  const handleDeletePage = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (pages.length <= 1) return; // Keep at least one page

    const updated = pages.filter((p) => p.id !== id);
    setPages(updated);

    if (activePageId === id) {
      const nextActive = updated[0]?.id || "";
      setActivePageId(nextActive);
      localStorage.setItem(STORAGE_KEY_ACTIVE, nextActive);
    }

    try {
      localStorage.setItem(STORAGE_KEY_PAGES, JSON.stringify(updated));
    } catch (err) {
      console.error("Storage error deleting page:", err);
    }
  };

  // 7. Export Current Page to Markdown
  const handleExportMarkdown = () => {
    const activeNote = pages.find((p) => p.id === activePageId);
    if (!activeNote) return;

    const content = `# ${activeNote.title || "Untitled"}\n\n${activeNote.plainText || ""}`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(activeNote.title || "Untitled").replace(/[^\w-]/g, "_")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeNote = pages.find((p) => p.id === activePageId);

  // Avoid hydration mismatch while reading localStorage
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0d1117] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span>Opening NoteOcean workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d1117]">
      {/* Sidebar matching reference */}
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectPage={handleSelectPage}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        <HeaderBar
          pageTitle={activeNote?.title || "Untitled"}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNewPage={handleNewPage}
          onDeleteCurrentPage={() => activeNote && handleDeletePage(activeNote.id)}
          onExportMarkdown={handleExportMarkdown}
          isListening={isListening}
          onToggleDictation={toggleDictation}
          dictationSupported={dictationSupported}
        />

        {/* Editor Area */}
        {activeNote ? (
          <Editor
            key={activeNote.id}
            note={activeNote}
            onUpdate={handleUpdatePage}
            onStatusChange={setSaveStatus}
            editorRef={activeEditorRef}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            No page selected.
          </div>
        )}

        {/* Save Status Indicator at center-bottom */}
        <SaveStatus status={saveStatus} />

        {/* Floating NoteOcean AI Bot Drawer */}
        <AIBotDrawer
          pages={pages}
          activePageId={activePageId}
          onOpenPage={handleSelectPage}
        />
      </main>
    </div>
  );
}
