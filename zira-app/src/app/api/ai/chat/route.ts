import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: `أنت مساعد دراسي ذكي ومتخصص اسمك "زيرا AI".
تساعد الطلاب على الفهم والمراجعة وإنشاء بطاقات تعليمية وأسئلة.
أجب دائماً باللغة العربية بشكل واضح ومنظم.
استخدم النقاط والعناوين لتنظيم إجاباتك.
كن مشجعاً ومحفزاً للطلاب.`,
    messages: messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const content = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ content });
}
