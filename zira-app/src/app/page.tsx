import { redirect } from "next/navigation";

// Root redirect — middleware handles auth, so just redirect to app
export default function RootPage() {
  redirect("/app/dashboard");
}
