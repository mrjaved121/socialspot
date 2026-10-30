"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, CalendarDays, ListChecks, Link2, Settings, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/create", label: "New post", Icon: PlusCircle },
  { href: "/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/posts", label: "All posts", Icon: ListChecks },
  { href: "/accounts", label: "My apps", Icon: Link2 },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-ink">
      <span className="relative inline-block h-8 w-8 rounded-full bg-spot">
        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-ink" />
      </span>
      SocialSpot
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { toast, accounts } = useStore();
  const problems = accounts.filter((a) => !a.connected || a.needsReconnect).length;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1.5" aria-label="Main">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-bold transition ${
                active(href) ? "bg-ink text-white" : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <Icon size={22} aria-hidden />
              {label}
              {href === "/accounts" && problems > 0 && (
                <span className="ml-auto rounded-full bg-spot px-2 text-sm text-ink">{problems}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-paper p-4 text-sm text-ink-soft">
          <p className="font-bold text-ink">Need help?</p>
          <p className="mt-1">Tap “New post”, add a photo or video, write a caption and press Post. That’s it.</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <Link href="/settings" aria-label="Settings" className="rounded-xl p-2 text-ink-soft hover:bg-paper">
          <Settings size={24} />
        </Link>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-8 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV.filter((n) => n.href !== "/settings").map(({ href, label, Icon }) => {
          const isNew = href === "/create";
          return (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs font-bold ${
                active(href) ? "text-ink" : "text-ink-faint"
              }`}
            >
              {isNew ? (
                <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-spot text-ink shadow-[0_4px_0_#E5A800]">
                  <PlusCircle size={28} />
                </span>
              ) : (
                <Icon size={24} aria-hidden />
              )}
              {label}
            </Link>
          );
        })}
      </nav>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-ink px-5 py-3.5 font-bold text-white shadow-lg lg:bottom-8"
        >
          <CheckCircle2 size={20} className="text-spot" /> {toast}
        </div>
      )}
    </div>
  );
}
