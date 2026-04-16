import type { Metadata } from "next";
import { AIClient } from "./ai-client";

export const metadata: Metadata = { title: "المساعد الذكي" };

export default function AIPage() {
  return <AIClient />;
}
