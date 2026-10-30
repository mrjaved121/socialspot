"use client";

import Link from "next/link";
import { PlusCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { useStore, formatWhen, overallStatus } from "@/lib/store";
import { platformById, PlatformId } from "@/lib/platforms";
import { MediaThumb, PlatformStatus, StatusPill, btn } from "@/components/ui";

export default function Home() {
  const { posts, accounts } = useStore();
  const now = Date.now();
  const upcoming = posts
    .filter((p) => overallStatus(p) === "scheduled" && new Date(p.when).getTime() > now)
    .sort((a, b) => +new Date(a.when) - +new Date(b.when))
    .slice(0, 3);
  const recent = posts.filter((p) => overallStatus(p) !== "scheduled").slice(0, 5);
  const failed = posts.filter((p) => overallStatus(p) === "failed");
  const loginIssues = accounts.filter((a) => a.needsReconnect || !a.connected);

  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* Hero: the one thing to do */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-white sm:px-10 sm:py-12">
        <span aria-hidden className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-spot sm:-right-16 sm:-top-16 sm:h-80 sm:w-80" />
        <span aria-hidden className="absolute right-16 top-20 hidden h-8 w-8 rounded-full bg-ink sm:block" />
        <div className="relative max-w-lg">
          <p className="text-lg text-white/70">{hello}, Jay</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            One post.
            <br />
            Five apps.
            <br />
            One click.
          </h1>
          <Link
            href="/create"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-spot px-6 py-4 text-xl font-bold text-ink shadow-[0_5px_0_#E5A800] transition active:translate-y-1 active:shadow-none"
          >
            <PlusCircle size={24} /> Create a post
          </Link>
        </div>
      </section>

      {/* Problems first, in plain words */}
      {(failed.length > 0 || loginIssues.length > 0) && (
        <section className="mt-8" aria-labelledby="attn">
          <h2 id="attn" className="font-display text-2xl font-bold">
            Needs your attention
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {failed.map((p) => {
              const apps = (Object.entries(p.results) as [PlatformId, string][]).filter(([, s]) => s === "failed").map(([id]) => platformById(id).name);
              return (
                <li key={p.id}>
                  <Link href="/posts?filter=failed" className="flex items-center gap-4 rounded-2xl border-2 border-bad/30 bg-white p-4 hover:border-bad">
                    <AlertTriangle className="shrink-0 text-bad" />
                    <span className="flex-1">
                      <span className="block font-bold">A post didn’t go out on {apps.join(", ")}</span>
                      <span className="block text-ink-soft">Tap to try again</span>
                    </span>
                    <ChevronRight className="text-ink-faint" />
                  </Link>
                </li>
              );
            })}
            {loginIssues.map((a) => {
              const p = platformById(a.id);
              return (
                <li key={a.id}>
                  <Link href="/accounts" className="flex items-center gap-4 rounded-2xl border-2 border-warn/30 bg-white p-4 hover:border-warn">
                    <AlertTriangle className="shrink-0 text-warn" />
                    <span className="flex-1">
                      <span className="block font-bold">{a.connected ? `${p.name} login has expired` : `${p.name} is not connected`}</span>
                      <span className="block text-ink-soft">{a.connected ? "Tap to log in again" : "Tap to connect it"}</span>
                    </span>
                    <ChevronRight className="text-ink-faint" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="next" className="min-w-0">
          <div className="flex items-baseline justify-between">
            <h2 id="next" className="font-display text-2xl font-bold">
              Coming up
            </h2>
            <Link href="/calendar" className={btn.quiet}>
              Calendar
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-white p-6 text-ink-soft">Nothing scheduled. Create a post and choose “Schedule for later”.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {upcoming.map((p) => (
                <li key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-4">
                  <MediaThumb post={p} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{formatWhen(p.when)}</p>
                    <p className="truncate text-ink-soft">{p.caption}</p>
                  </div>
                  <span className="hidden text-sm font-bold text-ink-soft sm:block">{Object.keys(p.results).length} apps</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recent" className="min-w-0">
          <div className="flex items-baseline justify-between">
            <h2 id="recent" className="font-display text-2xl font-bold">
              Recent posts
            </h2>
            <Link href="/posts" className={btn.quiet}>
              See all
            </Link>
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {recent.map((p) => (
              <li key={p.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-4">
                  <MediaThumb post={p} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{p.caption}</p>
                    <p className="text-ink-soft">{formatWhen(p.when)}</p>
                  </div>
                  <span className="hidden sm:block">
                    <StatusPill status={overallStatus(p)} />
                  </span>
                </div>
                <div className="mt-3 flex gap-3 pl-[72px]">
                  {(Object.entries(p.results) as [PlatformId, never][]).map(([id, s]) => (
                    <PlatformStatus key={id} id={id} status={s} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
