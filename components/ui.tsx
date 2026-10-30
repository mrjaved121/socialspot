"use client";

import { CheckCircle2, Clock, Loader2, XCircle, Film, ImageIcon } from "lucide-react";
import { Platform, platformById, PlatformId } from "@/lib/platforms";
import { Post, PostStatus } from "@/lib/store";

export function PlatformIcon({ platform, size = 36 }: { platform: Platform; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[30%] font-display font-bold text-white"
      style={{ background: platform.color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {platform.short}
    </span>
  );
}

const STATUS: Record<PostStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  posted: { label: "Posted", cls: "bg-ok-wash text-ok", Icon: CheckCircle2 },
  scheduled: { label: "Scheduled", cls: "bg-spot-wash text-ink", Icon: Clock },
  failed: { label: "Failed", cls: "bg-bad-wash text-bad", Icon: XCircle },
  sending: { label: "Sending", cls: "bg-paper text-ink-soft", Icon: Loader2 },
};

export function StatusPill({ status }: { status: PostStatus }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${s.cls}`}>
      <s.Icon size={16} className={status === "sending" ? "animate-spin" : ""} aria-hidden />
      {s.label}
    </span>
  );
}

/** Small app icon with a status mark in the corner */
export function PlatformStatus({ id, status }: { id: PlatformId; status: PostStatus }) {
  const p = platformById(id);
  const s = STATUS[status];
  const mark =
    status === "posted" ? "bg-ok" : status === "failed" ? "bg-bad" : status === "scheduled" ? "bg-spot" : "bg-ink-faint";
  return (
    <span className="relative inline-flex" title={`${p.name}: ${s.label}`}>
      <PlatformIcon platform={p} size={28} />
      <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${mark}`} />
      <span className="sr-only">
        {p.name}: {s.label}
      </span>
    </span>
  );
}

export function MediaThumb({ post, size = 56 }: { post: Post; size?: number }) {
  const isVideo = post.media.type === "video";
  if (post.media.url) {
    return isVideo ? (
      <video src={post.media.url} className="shrink-0 rounded-xl object-cover" style={{ width: size, height: size }} muted />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.media.url} alt="" className="shrink-0 rounded-xl object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-ink text-spot"
      style={{ width: size, height: size }}
      aria-label={isVideo ? "Video" : "Photo"}
    >
      {isVideo ? <Film size={size * 0.4} /> : <ImageIcon size={size * 0.4} />}
    </span>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1 text-lg text-ink-soft">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-lg font-bold text-white transition hover:bg-[#2B3160] disabled:cursor-not-allowed disabled:bg-ink-faint",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-line bg-white px-5 py-3 text-base font-bold text-ink transition hover:border-ink",
  quiet: "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-ink-soft hover:bg-paper hover:text-ink",
};
