import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteOcean — Modern AI Note Workspace",
  description: "A fast, keyboard-first note-taking workspace with real-time Markdown transformations, slash commands, and an open-weight Gemma 2 AI assistant grounded in your personal notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d1117] text-[#cbd5e1] min-h-screen antialiased selection:bg-[#153e44] selection:text-[#2dd4bf]">
        {children}
      </body>
    </html>
  );
}
