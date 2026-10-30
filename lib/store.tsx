"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PlatformId, PLATFORMS } from "./platforms";

export type PostStatus = "sending" | "posted" | "scheduled" | "failed";

export type Post = {
  id: string;
  caption: string;
  xCaption?: string;
  ytTitle?: string;
  media: { type: "image" | "video"; url?: string; name: string };
  results: Partial<Record<PlatformId, PostStatus>>;
  when: string; // ISO date the post goes out
};

export type Account = {
  id: PlatformId;
  connected: boolean;
  handle?: string;
  needsReconnect?: boolean;
};

export type Settings = {
  timezone: string;
  defaultPlatforms: PlatformId[];
  defaultTime: string;
};

type Store = {
  posts: Post[];
  accounts: Account[];
  settings: Settings;
  toast: string | null;
  addPost: (p: Post) => void;
  updateResult: (postId: string, platform: PlatformId, status: PostStatus) => void;
  deletePost: (postId: string) => void;
  setAccount: (id: PlatformId, patch: Partial<Account>) => void;
  saveSettings: (s: Settings) => void;
  showToast: (msg: string) => void;
};

const Ctx = createContext<Store | null>(null);

function daysFromNow(d: number, hour = 18) {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
}

const all = (s: PostStatus) =>
  Object.fromEntries(PLATFORMS.map((p) => [p.id, s])) as Record<PlatformId, PostStatus>;

const SEED_POSTS: Post[] = [
  { id: "p1", caption: "Dubai family visit package is back! Visa + city tour + desert safari + Burj Khalifa. DM us to book 🌴", media: { type: "video", name: "dubai-package.mp4" }, results: all("scheduled"), when: daysFromNow(0, 19) },
  { id: "p2", caption: "Saudi multiple-entry visa for UAE residents. Fast processing, no hassle. Message us today.", media: { type: "image", name: "saudi-visa.jpg" }, results: { facebook: "scheduled", instagram: "scheduled", tiktok: "scheduled", x: "scheduled" }, when: daysFromNow(2, 17) },
  { id: "p3", caption: "5 jobs in Dubai hiring this week — full list on thejobseek.com", media: { type: "image", name: "jobs-week.jpg" }, results: { facebook: "posted", instagram: "posted", tiktok: "failed", x: "posted" }, when: daysFromNow(-1, 12) },
  { id: "p4", caption: "How to start selling on Amazon from the UAE — step by step in 60 seconds.", media: { type: "video", name: "amazon-start.mp4" }, results: all("posted"), when: daysFromNow(-3, 20) },
  { id: "p5", caption: "Weekend desert safari deal: BBQ dinner, dune bashing and camel ride.", media: { type: "video", name: "safari.mp4" }, results: all("posted"), when: daysFromNow(-6, 16) },
];

const SEED_ACCOUNTS: Account[] = [
  { id: "facebook", connected: true, handle: "IT Solution NYC" },
  { id: "instagram", connected: true, handle: "@itsolutionnyc" },
  { id: "youtube", connected: true, handle: "IT Solution NYC" },
  { id: "tiktok", connected: true, handle: "@itsolutionnyc", needsReconnect: true },
  { id: "x", connected: false },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS);
  const [settings, setSettings] = useState<Settings>({
    timezone: "Asia/Dubai",
    defaultPlatforms: PLATFORMS.map((p) => p.id),
    defaultTime: "18:00",
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3200);
  }, []);

  const store: Store = {
    posts,
    accounts,
    settings,
    toast,
    addPost: (p) => setPosts((ps) => [p, ...ps]),
    updateResult: (postId, platform, status) =>
      setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, results: { ...p.results, [platform]: status } } : p))),
    deletePost: (postId) => setPosts((ps) => ps.filter((p) => p.id !== postId)),
    setAccount: (id, patch) => setAccounts((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    saveSettings: setSettings,
    showToast,
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

/** Overall status of a post across all its apps */
export function overallStatus(p: Post): PostStatus {
  const v = Object.values(p.results);
  if (v.includes("sending")) return "sending";
  if (v.includes("failed")) return "failed";
  if (v.includes("scheduled")) return "scheduled";
  return "posted";
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return `Today, ${time}`;
  if (same(d, tomorrow)) return `Tomorrow, ${time}`;
  if (same(d, yesterday)) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}, ${time}`;
}
