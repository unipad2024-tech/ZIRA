import type { Metadata } from "next";
import { SessionsClient } from "./sessions-client";

export const metadata: Metadata = { title: "الجلسات الجماعية" };

export default function SessionsPage() {
  return <SessionsClient />;
}
