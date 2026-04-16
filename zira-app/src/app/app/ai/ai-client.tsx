"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, BookOpen, FileText, HelpCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  { icon: "📚", label: "اشرح مفهوماً", prompt: "اشرح لي مفهوم " },
  { icon: "🃏", label: "أنشئ بطاقات", prompt: "أنشئ 5 بطاقات تعليمية عن " },
  { icon: "❓", label: "أسئلة MCQ",   prompt: "أنشئ 5 أسئلة اختيار من متعدد عن " },
  { icon: "📝", label: "ملخص سريع",   prompt: "اعطني ملخصاً سريعاً عن " },
  { icon: "🔬", label: "تحليل نص",    prompt: "حلل هذا النص: " },
  { icon: "💡", label: "أمثلة تطبيقية", prompt: "أعطني أمثلة تطبيقية على " },
];

export function AIClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content }] }),
      });

      if (!res.ok) throw new Error("فشل الطلب");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ. تأكد من إعداد مفتاح API." }]);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[var(--purple-glow)] border border-[rgba(168,85,247,0.3)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--purple)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">المساعد الذكي</h1>
          <p className="text-[var(--text-muted)] text-xs">مدعوم بـ Claude AI</p>
        </div>
        <Badge variant="purple" size="sm" className="mr-auto">
          <Sparkles className="w-3 h-3" /> ذكاء اصطناعي
        </Badge>
      </div>

      {/* Quick prompts – shown only when no messages */}
      {messages.length === 0 && (
        <div className="mb-4 shrink-0">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--purple-glow)] border border-[rgba(168,85,247,0.3)] flex items-center justify-center mx-auto mb-3">
              <Bot className="w-8 h-8 text-[var(--purple)]" />
            </div>
            <h2 className="font-bold text-[var(--text)] text-lg">كيف يمكنني مساعدتك؟</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">اسألني أي شيء — سأشرح، أنشئ بطاقات، وأولّد أسئلة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => setInput(qp.prompt)}
                className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--purple)] hover:bg-[var(--purple-glow)] transition-all text-sm text-[var(--text-soft)] hover:text-[var(--text)] text-right"
              >
                <span>{qp.icon}</span>
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 animate-fade-in",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "assistant"
                ? "bg-[var(--purple-glow)] border border-[rgba(168,85,247,0.3)]"
                : "bg-gradient-to-br from-[var(--gold)] to-[var(--orange)]"
            )}>
              {msg.role === "assistant"
                ? <Bot className="w-4 h-4 text-[var(--purple)]" />
                : <User className="w-4 h-4 text-[#0B0B12]" />
              }
            </div>

            {/* Bubble */}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
              msg.role === "assistant"
                ? "bg-[var(--bg-surface2)] border border-[var(--border)] text-[var(--text)]"
                : "bg-[var(--gold)] text-[#0B0B12] font-medium"
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--purple-glow)] border border-[rgba(168,85,247,0.3)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[var(--purple)]" />
            </div>
            <div className="bg-[var(--bg-surface2)] border border-[var(--border)] rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 text-[var(--purple)] animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-3 flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="اسأل أي سؤال... (Enter للإرسال)"
          className="flex-1 bg-transparent text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm resize-none outline-none max-h-32 leading-relaxed"
          rows={1}
        />
        <Button
          variant="gold"
          size="icon"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
