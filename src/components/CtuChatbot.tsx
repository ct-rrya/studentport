"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { getCampusBySlug } from "@/data/campuses";
import { CHAT_PREFILL_EVENT, useCampus } from "@/context/CampusContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const INITIAL_ASSISTANT_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the **7U AI Assistant** (CTU Student & Campus Portal). Ask me about synced **ctu.edu.ph** announcements, campus locations, academic programs, official portals, or what **7U** stands for!",
};

// tiny inline markdown parser for bold, links, and inline code so we dont ship a heavy md lib
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokenRegex = /(\[[^\]]+\]\((?:https?:\/\/|\/)[^\s)]+\)|\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s<)]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = href.startsWith("http");
        parts.push(
          <a
            key={`${match.index}-link`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="font-semibold text-[#EE6200] underline underline-offset-2 hover:text-[#2A170B]"
          >
            {label}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`${match.index}-b`} className="font-bold text-[#2A170B]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`${match.index}-c`}
          className="rounded bg-[#FFEFD0] px-1 py-0.5 font-mono text-[11px] text-[#2A170B]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("http")) {
      const cleanUrl = token.replace(/[.,;!?]+$/, "");
      const trailing = token.slice(cleanUrl.length);
      parts.push(
        <a
          key={`${match.index}-u`}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#EE6200] underline underline-offset-2 break-all hover:text-[#2A170B]"
        >
          {cleanUrl}
        </a>
      );
      if (trailing) parts.push(trailing);
    }

    lastIdx = tokenRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts;
}

function SimpleMarkdown({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={keyPrefix} className="my-1.5 list-disc space-y-1 pl-4">
        {listItems.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (/^[-*•]\s+/.test(line)) {
      listItems.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }

    flushList(`list-${idx}`);

    if (!line) {
      return;
    }

    blocks.push(
      <p key={`p-${idx}`} className="my-1 leading-relaxed">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushList("list-end");

  return <div className="space-y-0.5">{blocks}</div>;
}

export function CtuChatbot() {
  const { selectedCampus, chatOpen: open, setChatOpen: setOpen } = useCampus();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgSeqRef = useRef(0);

  const nextId = (prefix: string) => {
    msgSeqRef.current += 1;
    return `${prefix}-${msgSeqRef.current}`;
  };

  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  const suggestions = useMemo(() => {
    const campusChip = activeCampus
      ? `Latest ${activeCampus.shortName.replace("CTU ", "")} updates?`
      : "Latest Daanbantayan updates?";
    return [
      campusChip,
      "How do I access CTU enrollment?",
      "List all CTU satellite campuses",
    ];
  }, [activeCampus]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // listen for prefill prompts from program matcher cards and focus the input box
  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const prompt = (event as CustomEvent<string>).detail;
      if (typeof prompt === "string" && prompt.trim()) {
        setInput(prompt);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    };
    window.addEventListener(CHAT_PREFILL_EVENT, handlePrefill);
    return () => window.removeEventListener(CHAT_PREFILL_EVENT, handlePrefill);
  }, []);

  async function sendMessage(textOverride?: string) {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: nextId("u"),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textOverride) setInput("");
    setLoading(true);

    try {
      const historyPayload = nextMessages
        .filter((m) => m.id !== "welcome" && !m.isError)
        .slice(-7, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          selectedCampus,
          history: historyPayload,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId("err"),
            role: "assistant",
            content:
              data.error ||
              "Sorry, I couldn't reach the assistant right now. Please try again.",
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId("a"),
            role: "assistant",
            content: data.reply!,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId("err"),
          role: "assistant",
          content: "Network error while contacting `/api/chat`. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([INITIAL_ASSISTANT_MSG]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* chat panel */}
      {open && (
        <div className="mb-3 flex h-[500px] max-h-[78vh] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[22px] border border-[#EBD3AE] bg-[#FFF9EC] shadow-2xl">
          {/* header */}
          <div className="flex items-center justify-between gap-2 bg-[#2A170B] px-4 py-3 text-[#FFF9EC]">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#EE6200] text-[#2A170B]">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h2 className="display truncate text-sm font-bold">
                  7U AI Assistant
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF9A00]" />
                  <span className="truncate text-[11px] text-[#E9D7B8]">
                    {activeCampus ? activeCampus.shortName : "All 29 Campuses"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat history"
                className="rounded-lg p-1.5 text-[#E9D7B8] transition-colors hover:bg-[#5A3A22] hover:text-[#FFF9EC]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close CTU AI Assistant"
                className="rounded-lg p-1.5 text-[#E9D7B8] transition-colors hover:bg-[#5A3A22] hover:text-[#FFF9EC]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* message thread */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#FFEFD0]/65 p-4"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] ${
                      isUser
                        ? "rounded-br-sm bg-[#2A170B] text-[#FFF9EC]"
                        : msg.isError
                        ? "rounded-bl-sm border border-[#EE6200]/40 bg-[#FBA17E]/25 text-[#2A170B]"
                        : "rounded-bl-sm border border-[#EBD3AE] bg-[#FFF9EC] text-[#2A170B]"
                    }`}
                  >
                    <SimpleMarkdown content={msg.content} isUser={isUser} />
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#EBD3AE] bg-[#FFF9EC] px-3.5 py-2.5 text-xs text-[#6B4A33]">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2A170B] [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EE6200] [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FF9A00]" />
                  <span className="ml-1">Checking CTU records...</span>
                </div>
              </div>
            )}

            {/* quick-start suggestion chips when conversation is fresh */}
            {messages.length <= 1 && !loading && (
              <div className="pt-1">
                <span className="mb-1.5 block text-[11px] font-bold tracking-[0.05em] text-[#6B4A33] uppercase">
                  Quick Questions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-[#EBD3AE] bg-[#FFF9EC] px-3 py-1 text-left text-[11px] font-medium text-[#2A170B] transition-colors hover:border-[#EE6200] hover:bg-[#F7D794]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* input bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-[#EBD3AE] bg-[#FFF9EC] p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about CTU updates, campuses..."
              disabled={loading}
              className="h-10 flex-1 rounded-[12px] border border-[#EBD3AE] bg-[#FFEFD0] px-3 text-xs text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:bg-[#FFF9EC] focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#FF9A00] text-[#2A170B] transition-colors hover:bg-[#EE6200] hover:text-[#FFF9EC] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* floating trigger button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-full bg-[#2A170B] px-4 py-3 text-sm font-bold text-[#FFF9EC] shadow-lg ring-2 ring-[#FF9A00] transition-all hover:-translate-y-0.5 hover:bg-[#EE6200]"
        >
          {open ? (
            <>
              <X className="h-4 w-4 text-[#FF9A00]" />
              <span>Close Assistant</span>
            </>
          ) : (
            <>
              <MessageSquareText className="h-4 w-4 text-[#FF9A00]" />
              <span>Ask CTU AI</span>
              <Sparkles className="h-3.5 w-3.5 text-[#F7D794]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
