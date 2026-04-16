import type { Metadata } from "next";
import { TimerClient } from "./timer-client";

export const metadata: Metadata = { title: "مؤقت التركيز" };

export default function TimerPage() {
  return <TimerClient />;
}
