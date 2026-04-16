import type { Metadata } from "next";
import { FlashcardsClient } from "./flashcards-client";

export const metadata: Metadata = { title: "البطاقات التعليمية" };

export default function FlashcardsPage() {
  return <FlashcardsClient />;
}
