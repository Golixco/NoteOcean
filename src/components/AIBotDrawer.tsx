"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { NotePage, ChatMessage } from "@/types/note";
import { retrieveRelevantNotes } from "@/lib/retrieval";
import { WaveLogo } from "./Icons";

interface AIBotDrawerProps {
  pages: NotePage[];
  activePageId: string;
  onOpenPage: (pageId: string) => void;
}

export function AIBotDrawer({ pages, activePageId, onOpenPage }: AIBotDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am **NoteOcean Bot**, an AI assistant powered by **Google Gemma 2 (9B open-weights)**.\n\nI answer questions strictly grounded in your personal saved notes, citing the exact source documents. Ask me anything about your notes!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Step 1: Perform client-side retrieval across browser-saved notes
      const retrievedSnippets = retrieveRelevantNotes(pages, query, activePageId);

      // Step 2: Forward query and retrieved snippets to server-side proxy
      const response = await fetch("/api/bot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          snippets: retrievedSnippets,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "ast-" + Date.now(),
        role: "assistant",
        content: data.reply || "Sorry, I could not generate a response.",
        citations: data.citations || [],
        timestamp: new Date().toISOString(),
        isError: !response.ok,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: `⚠️ Failed to reach assistant: ${err.message}`,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sampleQuestions = [
    "What are the phases in my hackathon plan?",
    "What deadline did I record?",
    "Find the details about the fictional contact Alex.",
    "Which features belong in the first release?",
  ];

  return (
    <>
      {/* Floating Glowing Bot Button (matching reference) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        {!isOpen && (
          <div className="mb-2 px-3 py-1 rounded-full bg-[#1e2630] border border-white/[0.08] text-xs font-medium text-[#f8fafc] shadow-lg animate-bounce pointer-events-none select-none">
            Ask NoteOcean AI
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Open NoteOcean AI Assistant"
          className="relative w-13 h-13 rounded-full bg-[#0d1e24] border-2 border-[#2dd4bf] flex items-center justify-center p-3 text-[#2dd4bf] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)]"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <WaveLogo className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Slide-up Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 w-[420px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-120px)] bg-[#151c24] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-white/[0.08] bg-[#0f141c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#162a2d] border border-[#14b8a6] flex items-center justify-center">
                <WaveLogo className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#f8fafc]">NoteOcean Bot</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#153e44] text-[#2dd4bf] border border-[#14b8a6]/40">
                    Gemma 2 (9B)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  <span>Strictly grounded in your notes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                      isUser
                        ? "bg-[#16383a] text-white border border-[#14b8a6]/40"
                        : "bg-[#18212c] text-[#cbd5e1] border border-white/[0.06]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                      {msg.content}
                    </div>

                    {/* Source Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-slate-400 w-full font-medium">
                          Sources consulted:
                        </span>
                        {msg.citations.map((cite) => (
                          <button
                            key={cite.id}
                            onClick={() => {
                              onOpenPage(cite.id);
                              // On small screens, close the drawer so user sees the note
                              if (window.innerWidth < 768) setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#153e44] hover:bg-[#1c5058] text-[#2dd4bf] text-[11px] border border-[#14b8a6]/40 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">{cite.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#2dd4bf]" />
                <span>Consulting notes with Gemma 2...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              <div className="text-[10px] text-slate-400 font-medium px-1">Suggested inquiries:</div>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuestions.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] text-slate-300 hover:text-white bg-[#1a232f] hover:bg-[#202c3b] px-2.5 py-1 rounded-full border border-white/[0.06] text-left transition-colors flex items-center gap-1"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-teal-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="px-4 py-1 bg-[#10161f] border-t border-white/[0.04] text-[10px] text-slate-500 text-center">
            Zero cloud database. Only matching excerpts are sent to Gemma 2.
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-white/[0.08] bg-[#0f141c]">
            <div className="flex items-center gap-2 bg-[#18212c] rounded-xl border border-white/[0.08] focus-within:border-[#14b8a6] px-3 py-1.5 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your notes..."
                disabled={isLoading}
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                title="Send inquiry"
                className="p-1.5 rounded-lg bg-[#16383a] hover:bg-[#1c484b] text-[#2dd4bf] disabled:opacity-40 disabled:hover:bg-[#16383a] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
