"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, RotateCcw, Trash2, PlusCircle } from "lucide-react";
import { useStore, formatWhen, overallStatus, PostStatus } from "@/lib/store";
import { platformById, PlatformId } from "@/lib/platforms";
import { MediaThumb, PageTitle, PlatformIcon, StatusPill, btn } from "@/components/ui";

const FILTERS: { v: "all" | PostStatus; label: string }[] = [
  { v: "all", label: "All" },
  { v: "posted", label: "Posted" },
  { v: "scheduled", label: "Scheduled" },
  { v: "failed", label: "Failed" },
];

function PostsList() {
  const params = useSearchParams();
  const { posts, updateResult, deletePost, showToast } = useStore();
  const [filter, setFilter] = useState<"all" | PostStatus>((params.get("filter") as PostStatus) || "all");
  const [q, setQ] = useState("");

  const shown = posts
    .filter((p) => filter === "all" || overallStatus(p) === filter)
    .filter((p) => p.caption.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => +new Date(b.when) - +new Date(a.when));

  function retry(postId: string, id: PlatformId) {
    updateResult(postId, id, "sending");
    window.setTimeout(() => {
      updateResult(postId, id, "posted");
      showToast(`Posted to ${platformById(id).name}`);
    }, 1200);
  }

  return (
    <>
      <PageTitle
        title="All posts"
        sub="Every post and where it went."
        action={
          <Link href="/create" className={btn.primary}>
            <PlusCircle size={20} /> New post
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.v}
              role="tab"
              aria-selected={filter === f.v}
              onClick={() => setFilter(f.v)}
              className={`shrink-0 rounded-full px-4 py-2 font-bold ${filter === f.v ? "bg-ink text-white" : "bg-white text-ink-soft"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="relative sm:ml-auto sm:w-72">
          <span className="sr-only">Search captions</span>
          <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search captions"
            className="w-full rounded-2xl border-2 border-line bg-white py-2.5 pl-11 pr-4 outline-none focus:border-ink"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-10 text-center">
          <p className="font-display text-xl font-bold">No posts here</p>
          <p className="mt-1 text-ink-soft">{filter === "failed" ? "Nothing failed. Every post went out." : "Try another filter or create a new post."}</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {shown.map((p) => (
            <li key={p.id} className="rounded-3xl bg-white p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <MediaThumb post={p} size={64} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={overallStatus(p)} />
                    <span className="text-ink-soft">{formatWhen(p.when)}</span>
                  </div>
                  <p className="mt-2 line-clamp-2">{p.caption}</p>
                </div>
                {overallStatus(p) === "scheduled" && (
                  <button
                    onClick={() => {
                      deletePost(p.id);
                      showToast("Scheduled post deleted");
                    }}
                    className={btn.quiet}
                    aria-label="Delete scheduled post"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {(Object.entries(p.results) as [PlatformId, PostStatus][]).map(([id, s]) => {
                  const pf = platformById(id);
                  return (
                    <li key={id} className={`flex items-center gap-2.5 rounded-2xl p-2.5 ${s === "failed" ? "bg-bad-wash" : "bg-paper"}`}>
                      <PlatformIcon platform={pf} size={30} />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-sm font-bold">{pf.name}</span>
                        <span className={`block text-sm ${s === "failed" ? "text-bad" : s === "posted" ? "text-ok" : "text-ink-soft"}`}>
                          {s === "posted" ? "Posted" : s === "failed" ? "Failed" : s === "sending" ? "Sending…" : "Scheduled"}
                        </span>
                      </span>
                      {s === "failed" && (
                        <button onClick={() => retry(p.id, id)} className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-sm font-bold text-ink">
                          <RotateCcw size={14} /> Try again
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function PostsPage() {
  return (
    <Suspense>
      <PostsList />
    </Suspense>
  );
}
