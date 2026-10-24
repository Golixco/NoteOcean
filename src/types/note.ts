export interface NotePage {
  id: string;
  title: string;
  icon?: string;
  content: any; // Tiptap JSON content
  plainText: string;
  updatedAt: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Array<{
    id: string;
    title: string;
  }>;
  timestamp: string;
  isError?: boolean;
}

export interface SearchMatch {
  page: NotePage;
  snippet?: string;
  score: number;
}
