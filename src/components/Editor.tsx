"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  CheckSquare,
  Quote,
  Minus,
  Plus,
} from "lucide-react";
import { NotePage } from "@/types/note";
import { SlashMenu, SlashItem } from "./SlashMenu";
import { DragHandleIcon } from "./Icons";

interface EditorProps {
  note: NotePage;
  onUpdate: (id: string, updates: Partial<NotePage>) => void;
  onStatusChange: (status: "saved" | "saving" | "error") => void;
  editorRef?: React.MutableRefObject<any>;
}

// Custom CodeBlock with Tab key handling (2 spaces)
const CustomCodeBlock = CodeBlock.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        if (editor.isActive("codeBlock")) {
          return editor.commands.insertContent("  ");
        }
        return false;
      },
    };
  },
});

export function Editor({ note, onUpdate, onStatusChange, editorRef }: EditorProps) {
  const [title, setTitle] = useState(note.title);
  const [slashMenuState, setSlashMenuState] = useState<{
    isOpen: boolean;
    query: string;
    position: { top: number; left: number };
    range: { from: number; to: number } | null;
  }>({
    isOpen: false,
    query: "",
    position: { top: 0, left: 0 },
    range: null,
  });

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdateRef = useRef(false);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // Replaced by CustomCodeBlock
      }),
      CustomCodeBlock.configure({
        HTMLAttributes: {
          class: "rounded-lg bg-[#151c24] border border-white/[0.08] p-4 font-mono text-sm",
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Type '/' for commands or write naturally...",
      }),
    ],
    content: note.content || { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[400px] text-base leading-relaxed text-[#cbd5e1]",
      },
    },
    onUpdate: ({ editor }) => {
      onStatusChange("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        const json = editor.getJSON();
        const text = editor.getText();
        onUpdate(note.id, {
          content: json,
          plainText: text,
          updatedAt: new Date().toISOString(),
        });
        onStatusChange("saved");
      }, 500);

      // Check for slash menu trigger
      checkSlashCommand(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      checkSlashCommand(editor);
    },
  });

  if (editorRef) {
    editorRef.current = editor;
  }

  // Update editor content when note changes from external source (e.g. sidebar switch)
  useEffect(() => {
    setTitle(note.title);
    if (editor && !editor.isDestroyed) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(note.content);
      if (currentJson !== newJson) {
        editor.commands.setContent(note.content || { type: "doc", content: [{ type: "paragraph" }] }, false);
      }
    }
  }, [note.id]);

  // Check if current line has a slash trigger
  const checkSlashCommand = useCallback((ed: any) => {
    if (!ed || ed.isActive("codeBlock")) {
      setSlashMenuState((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      return;
    }

    const { selection, doc } = ed.state;
    const { from, to } = selection;

    if (from !== to) {
      setSlashMenuState((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      return;
    }

    // Inspect text in current block preceding caret
    const resolvedPos = doc.resolve(from);
    const startOfBlock = resolvedPos.start();
    const textBefore = doc.textBetween(startOfBlock, from, "\0", "\0");

    const slashMatch = textBefore.match(/(?:^|\s)\/([a-zA-Z0-9_-]*)$/);

    if (slashMatch) {
      const query = slashMatch[1];
      const matchIndex = textBefore.lastIndexOf("/" + query);
      const slashFrom = startOfBlock + matchIndex;

      try {
        const coords = ed.view.coordsAtPos(from);
        setSlashMenuState({
          isOpen: true,
          query,
          position: {
            top: coords.bottom + 8,
            left: Math.min(coords.left, window.innerWidth - 280),
          },
          range: { from: slashFrom, to: from },
        });
      } catch (err) {
        // Position resolution error fallback
      }
    } else {
      setSlashMenuState((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
    }
  }, []);

  // Title change handler with debounced save
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onStatusChange("saving");

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      onUpdate(note.id, {
        title: newTitle || "Untitled",
        updatedAt: new Date().toISOString(),
      });
      onStatusChange("saved");
    }, 500);
  };

  // Title key down: Enter jumps to editor canvas
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      editor?.commands.focus("start");
    }
  };

  // Slash commands directory matching reference
  const slashItems: SlashItem[] = [
    {
      id: "code",
      title: "Code block",
      description: "Monospace syntax code container",
      icon: (
        <div className="w-5 h-5 rounded bg-[#16383a] border border-[#14b8a6] flex items-center justify-center text-[#2dd4bf] text-[10px] font-bold">
          &lt;/&gt;
        </div>
      ),
      keywords: ["code", "javascript", "typescript", "python", "block"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .toggleCodeBlock()
          .run();
      },
    },
    {
      id: "h1",
      title: "Heading 1",
      description: "Large section heading",
      icon: <Heading1 className="w-4 h-4" />,
      keywords: ["h1", "heading", "title", "large"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .setHeading({ level: 1 })
          .run();
      },
    },
    {
      id: "h2",
      title: "Heading 2",
      description: "Medium section heading",
      icon: <Heading2 className="w-4 h-4" />,
      keywords: ["h2", "heading", "subheading", "medium"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .setHeading({ level: 2 })
          .run();
      },
    },
    {
      id: "h3",
      title: "Heading 3",
      description: "Small section heading",
      icon: <Heading3 className="w-4 h-4" />,
      keywords: ["h3", "heading", "small"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .setHeading({ level: 3 })
          .run();
      },
    },
    {
      id: "bullet",
      title: "Bulleted list",
      description: "Unordered bullet point list",
      icon: <List className="w-4 h-4" />,
      keywords: ["bullet", "list", "unordered"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .toggleBulletList()
          .run();
      },
    },
    {
      id: "todo",
      title: "To-do list",
      description: "Track tasks with a to-do list",
      icon: <CheckSquare className="w-4 h-4" />,
      keywords: ["todo", "task", "check", "checkbox"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .toggleTaskList()
          .run();
      },
    },
    {
      id: "quote",
      title: "Quote",
      description: "Capture a quote or callout",
      icon: <Quote className="w-4 h-4" />,
      keywords: ["quote", "blockquote", "callout"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .toggleBlockquote()
          .run();
      },
    },
    {
      id: "divider",
      title: "Divider",
      description: "Visually divide blocks with a line",
      icon: <Minus className="w-4 h-4" />,
      keywords: ["divider", "line", "separator", "hr"],
      action: () => {
        if (!editor || !slashMenuState.range) return;
        editor
          .chain()
          .focus()
          .deleteRange(slashMenuState.range)
          .setHorizontalRule()
          .run();
      },
    },
  ];

  return (
    <div className="relative flex-1 overflow-y-auto px-6 py-10 md:px-12 flex justify-center">
      <div className="w-full max-w-[780px] relative">
        {/* Page Title (matching reference) */}
        <div className="mb-6 group relative">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className="w-full bg-transparent font-bold text-3xl md:text-4xl text-[#f8fafc] placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-white/[0.08] pb-2 transition-colors"
          />
        </div>

        {/* Editor Body Canvas */}
        <div className="relative min-h-[450px]">
          <EditorContent editor={editor} />
        </div>

        {/* Slash Command Palette Popover */}
        {slashMenuState.isOpen && (
          <SlashMenu
            query={slashMenuState.query}
            position={slashMenuState.position}
            onClose={() =>
              setSlashMenuState((prev) => ({ ...prev, isOpen: false }))
            }
            items={slashItems}
          />
        )}
      </div>
    </div>
  );
}
