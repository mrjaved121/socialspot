"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { useStore, overallStatus, Post } from "@/lib/store";
import { PlatformId } from "@/lib/platforms";
import { MediaThumb, PageTitle, PlatformStatus, btn } from "@/components/ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const { posts } = useStore();
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [picked, setPicked] = useState(today.toDateString());

  const first = new Date(month);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length % 7) cells.push(null);

  const byDay = (d: Date) => posts.filter((p) => new Date(p.when).toDateString() === d.toDateString());
  const pickedPosts: Post[] = posts
    .filter((p) => new Date(p.when).toDateString() === picked)
    .sort((a, b) => +new Date(a.when) - +new Date(b.when));

  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const dot = (p: Post) => {
    const s = overallStatus(p);
    return s === "posted" ? "bg-ok" : s === "failed" ? "bg-bad" : "bg-spot";
  };

  return (
    <>
      <PageTitle
        title="Calendar"
        sub="Tap a day to see what goes out."
        action={
          <Link href="/create" className={btn.primary}>
            <PlusCircle size={20} /> New post
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="min-w-0 rounded-3xl bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => shift(-1)} className={btn.quiet} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <h2 className="font-display text-2xl font-bold">{month.toLocaleDateString([], { month: "long", year: "numeric" })}</h2>
            <button onClick={() => shift(1)} className={btn.quiet} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold text-ink-faint">
            {DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const list = byDay(d);
              const isToday = d.toDateString() === today.toDateString();
              const isPicked = d.toDateString() === picked;
              return (
                <button
                  key={i}
                  onClick={() => setPicked(d.toDateString())}
                  aria-label={`${d.toDateString()}, ${list.length} posts`}
                  aria-pressed={isPicked}
                  className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-xl p-1 pt-2 transition sm:aspect-[1/0.85] ${
                    isPicked ? "bg-ink text-white" : "hover:bg-paper"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold ${isToday && !isPicked ? "bg-spot text-ink" : ""}`}>
                    {d.getDate()}
                  </span>
                  <span className="flex gap-0.5">
                    {list.slice(0, 3).map((p) => (
                      <span key={p.id} className={`h-2 w-2 rounded-full ${dot(p)}`} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-spot" /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ok" /> Posted</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-bad" /> Failed</span>
          </div>
        </section>

        <section aria-live="polite" className="min-w-0">
          <h2 className="font-display text-2xl font-bold">
            {new Date(picked).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          {pickedPosts.length === 0 ? (
            <div className="mt-3 rounded-3xl bg-white p-6">
              <p className="text-ink-soft">Nothing on this day.</p>
              <Link href="/create" className={`${btn.secondary} mt-4`}>
                Schedule a post
              </Link>
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {pickedPosts.map((p) => (
                <li key={p.id} className="rounded-2xl bg-white p-4">
                  <div className="flex items-center gap-3">
                    <MediaThumb post={p} size={48} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{new Date(p.when).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                      <p className="truncate text-ink-soft">{p.caption}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    {(Object.entries(p.results) as [PlatformId, never][]).map(([id, s]) => (
                      <PlatformStatus key={id} id={id} status={s} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
