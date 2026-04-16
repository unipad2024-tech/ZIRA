import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/components/providers";
import { RenaissanceEffects } from "@/components/renaissance/effects";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <AuthProvider>
      <RenaissanceEffects />

      <div className="flex h-screen overflow-hidden bg-app">
        {/* Sidebar – desktop only */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Bottom nav – mobile only */}
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
