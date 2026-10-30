"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { UploadCloud, X as XIcon, AlertTriangle, Send, CalendarClock, Zap, CheckCircle2, Loader2, XCircle, RotateCcw, Film } from "lucide-react";
import { PLATFORMS, PlatformId, platformById } from "@/lib/platforms";
import { useStore, Post } from "@/lib/store";
import { PlatformIcon, PageTitle, btn } from "@/components/ui";

type Media = { type: "image" | "video"; url: string; name: string; duration?: number };

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-spot font-display text-xl font-extrabold text-ink">
          {n}
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {hint && <p className="text-ink-soft">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function CreatePost() {
  const { accounts, settings, addPost, updateResult, showToast } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<Media | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [caption, setCaption] = useState("");
  const [xCaption, setXCaption] = useState("");
  const [ytTitle, setYtTitle] = useState("");
  // Start with the default apps that are connected
  const [selected, setSelected] = useState<PlatformId[]>(() =>
    settings.defaultPlatforms.filter((id) => accounts.find((a) => a.id === id)?.connected)
  );
  const [when, setWhen] = useState<"now" | "later">("now");
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState(settings.defaultTime);
  const [preview, setPreview] = useState<PlatformId>("instagram");
  const [sentId, setSentId] = useState<string | null>(null);

  const connected = (id: PlatformId) => accounts.find((a) => a.id === id)?.connected;

  function pickFile(f?: File | null) {
    if (!f) return;
    const isVideo = f.type.startsWith("video");
    if (!isVideo && !f.type.startsWith("image")) {
      showToast("Please choose a photo or a video");
      return;
    }
    const url = URL.createObjectURL(f);
    const m: Media = { type: isVideo ? "video" : "image", url, name: f.name };
    if (isVideo) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => setMedia({ ...m, duration: v.duration });
      v.src = url;
    }
    setMedia(m);
  }

  function toggle(id: PlatformId) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  const xText = xCaption || caption;

  const warnings = useMemo(() => {
    const w: { text: string; fix?: { label: string; run: () => void } }[] = [];
    if (media?.type === "image" && selected.includes("youtube"))
      w.push({ text: "YouTube only accepts videos. Add a video or turn YouTube off.", fix: { label: "Turn off YouTube", run: () => toggle("youtube") } });
    if (selected.includes("x") && xText.length > 280)
      w.push({ text: `Your caption is ${xText.length} letters. X allows 280. Write a short caption for X below.` });
    if (media?.duration && media.duration > 140 && selected.includes("x"))
      w.push({ text: "Your video is longer than 2 min 20 sec. X won’t accept it.", fix: { label: "Turn off X", run: () => toggle("x") } });
    selected.forEach((id) => {
      const acc = accounts.find((a) => a.id === id);
      if (!acc?.connected)
        w.push({ text: `${platformById(id).name} is not connected yet.`, fix: { label: "Turn it off", run: () => toggle(id) } });
      else if (acc.needsReconnect)
        w.push({ text: `${platformById(id).name} login has expired. Log in again in My apps, or turn it off.`, fix: { label: "Turn it off", run: () => toggle(id) } });
    });
    return w;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, selected, xText, accounts]);

  const missing = !media
    ? "Add a photo or video first"
    : !caption.trim()
    ? "Write a caption first"
    : selected.length === 0
    ? "Choose at least one app"
    : warnings.length > 0
    ? "Fix the orange notes above to post"
    : null;
  const canPost = !missing && warnings.length === 0;

  function submit() {
    if (!media || !canPost) return;
    const id = `p${Date.now()}`;
    const whenIso = when === "now" ? new Date().toISOString() : new Date(`${date}T${time}`).toISOString();
    const status = when === "now" ? "sending" : "scheduled";
    const post: Post = {
      id,
      caption,
      xCaption: xCaption || undefined,
      ytTitle: ytTitle || undefined,
      media: { type: media.type, url: media.url, name: media.name },
      results: Object.fromEntries(selected.map((p) => [p, status])),
      when: whenIso,
    };
    addPost(post);
    if (when === "later") {
      showToast(`Scheduled for ${selected.length} apps`);
      setSentId(id);
      return;
    }
    // Demo: pretend each app finishes at a different speed.
    // Later this is replaced by real status updates from the server.
    selected.forEach((p, i) => window.setTimeout(() => updateResult(id, p, "posted"), 900 + i * 700));
    setSentId(id);
  }

  function reset() {
    setMedia(null);
    setCaption("");
    setXCaption("");
    setYtTitle("");
    setWhen("now");
    setSentId(null);
  }

  if (sentId) return <Result postId={sentId} onNew={reset} />;

  const previewId = selected.includes(preview) ? preview : selected[0];

  return (
    <>
      <PageTitle title="New post" sub="Add it once. We post it everywhere you choose." />

      <div className="grid gap-6 pb-28 lg:grid-cols-[1fr_360px] lg:pb-0">
        <div className="flex min-w-0 flex-col gap-6">
          {/* STEP 1 */}
          <Step n={1} title="Add your photo or video" hint="JPG, PNG or MP4. Tall (9:16) videos look best.">
            {media ? (
              <div className="flex items-center gap-4 rounded-2xl bg-paper p-3">
                {media.type === "video" ? (
                  <video src={media.url} className="h-24 w-24 rounded-xl object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.url} alt="Your upload" className="h-24 w-24 rounded-xl object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{media.name}</p>
                  <p className="text-ink-soft">
                    {media.type === "video" ? "Video" : "Photo"}
                    {media.duration ? ` · ${Math.round(media.duration)} seconds` : ""}
                  </p>
                </div>
                <button className={btn.quiet} onClick={() => setMedia(null)}>
                  <XIcon size={18} /> Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  pickFile(e.dataTransfer.files[0]);
                }}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-[3px] border-dashed px-6 py-12 text-center transition ${
                  dragOver ? "border-spot-deep bg-spot-wash" : "border-line bg-paper hover:border-ink-faint"
                }`}
              >
                <UploadCloud size={44} className="text-ink" />
                <span className="font-display text-xl font-bold">Tap to choose a file</span>
                <span className="text-ink-soft">or drag it here</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
          </Step>

          {/* STEP 2 */}
          <Step n={2} title="Write your caption" hint="One caption for all apps. Add hashtags at the end.">
            <label htmlFor="caption" className="sr-only">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              placeholder="Example: Dubai visit visa in 3 days ✈️ Message us to apply. #dubai #visa"
              className="w-full resize-y rounded-2xl border-2 border-line bg-white p-4 text-lg outline-none focus:border-ink"
            />
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Letters used per app">
              {PLATFORMS.filter((p) => selected.includes(p.id) && p.captionLimit < 10000).map((p) => {
                const len = p.id === "x" ? xText.length : caption.length;
                const over = len > p.captionLimit;
                return (
                  <span key={p.id} className={`rounded-full px-3 py-1 text-sm font-bold ${over ? "bg-bad-wash text-bad" : "bg-paper text-ink-soft"}`}>
                    {p.name} {len}/{p.captionLimit}
                  </span>
                );
              })}
            </div>

            {selected.includes("x") && caption.length > 280 && (
              <div className="mt-5">
                <label htmlFor="xcap" className="mb-1.5 block font-bold">
                  Short caption for X <span className="font-normal text-ink-soft">(280 letters max)</span>
                </label>
                <textarea
                  id="xcap"
                  value={xCaption}
                  onChange={(e) => setXCaption(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border-2 border-line p-4 text-lg outline-none focus:border-ink"
                />
              </div>
            )}

            {selected.includes("youtube") && media?.type !== "image" && (
              <div className="mt-5">
                <label htmlFor="yt" className="mb-1.5 block font-bold">
                  YouTube title <span className="font-normal text-ink-soft">(optional, 100 letters max)</span>
                </label>
                <input
                  id="yt"
                  value={ytTitle}
                  maxLength={100}
                  onChange={(e) => setYtTitle(e.target.value)}
                  placeholder="We’ll use the first line of your caption if empty"
                  className="w-full rounded-2xl border-2 border-line p-4 text-lg outline-none focus:border-ink"
                />
              </div>
            )}
          </Step>

          {/* STEP 3 */}
          <Step n={3} title="Choose where to post" hint="Tap an app to turn it on or off.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PLATFORMS.map((p) => {
                const on = selected.includes(p.id);
                const ok = connected(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() => toggle(p.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      on ? "border-ink bg-white" : "border-line bg-paper opacity-70"
                    }`}
                  >
                    <PlatformIcon platform={p} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{p.name}</span>
                      <span className={`block text-sm ${ok ? "text-ink-soft" : "text-warn"}`}>{ok ? (on ? "Will post" : "Off") : "Not connected"}</span>
                    </span>
                    <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-ink" : "bg-line"}`} aria-hidden>
                      <span className={`absolute top-1 h-5 w-5 rounded-full transition-all ${on ? "left-6 bg-spot" : "left-1 bg-white"}`} />
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-ink-soft">
              App missing?{" "}
              <Link href="/accounts" className="font-bold text-ink underline underline-offset-4">
                Connect it in My apps
              </Link>
            </p>
          </Step>

          {/* STEP 4 */}
          <Step n={4} title="When should it go out?">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
              {[
                { v: "now" as const, Icon: Zap, t: "Post now", d: "Goes out in a few seconds" },
                { v: "later" as const, Icon: CalendarClock, t: "Schedule for later", d: "Pick a day and time" },
              ].map(({ v, Icon, t, d }) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={when === v}
                  onClick={() => setWhen(v)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left ${when === v ? "border-ink bg-spot-wash" : "border-line bg-white"}`}
                >
                  <Icon size={26} />
                  <span>
                    <span className="block font-bold">{t}</span>
                    <span className="block text-sm text-ink-soft">{d}</span>
                  </span>
                </button>
              ))}
            </div>
            {when === "later" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="font-bold">
                  Day
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 block w-full rounded-2xl border-2 border-line p-3.5 text-lg font-normal" />
                </label>
                <label className="font-bold">
                  Time <span className="font-normal text-ink-soft">({settings.timezone})</span>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 block w-full rounded-2xl border-2 border-line p-3.5 text-lg font-normal" />
                </label>
              </div>
            )}
          </Step>
        </div>

        {/* PREVIEW + POST */}
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-5">
            <h2 className="font-display text-xl font-bold">Preview</h2>
            {selected.length > 0 ? (
              <>
                <div className="mt-3 flex flex-wrap gap-2" role="tablist">
                  {selected.map((id) => {
                    const p = platformById(id);
                    return (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={previewId === id}
                        onClick={() => setPreview(id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-bold ${previewId === id ? "bg-ink text-white" : "bg-paper text-ink-soft"}`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
                <PhonePreview platform={previewId} media={media} caption={previewId === "x" ? xText : caption} title={ytTitle} />
              </>
            ) : (
              <p className="mt-3 text-ink-soft">Choose an app to see a preview.</p>
            )}
          </div>

          {warnings.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {warnings.map((w) => (
                <li key={w.text} className="flex items-start gap-3 rounded-2xl bg-warn-wash p-4 text-warn">
                  <AlertTriangle size={22} className="mt-0.5 shrink-0" />
                  <span className="flex-1">
                    <span className="block font-bold">{w.text}</span>
                    {w.fix && (
                      <button onClick={w.fix.run} className="mt-1 font-bold text-ink underline underline-offset-4">
                        {w.fix.label}
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="fixed inset-x-0 bottom-[72px] z-10 border-t border-line bg-white p-4 lg:static lg:mt-4 lg:border-0 lg:bg-transparent lg:p-0">
            <button onClick={submit} disabled={!canPost} className={`${btn.primary} w-full py-4 text-xl`}>
              {when === "now" ? <Send size={22} /> : <CalendarClock size={22} />}
              {when === "now" ? `Post to ${selected.length} ${selected.length === 1 ? "app" : "apps"}` : `Schedule for ${selected.length} ${selected.length === 1 ? "app" : "apps"}`}
            </button>
            {missing && <p className="mt-2 text-center text-ink-soft">{missing}</p>}
          </div>
        </aside>
      </div>
    </>
  );
}

function PhonePreview({ platform, media, caption, title }: { platform: PlatformId; media: Media | null; caption: string; title: string }) {
  const p = platformById(platform);
  const shown = caption.length > 140 ? caption.slice(0, 140) + "… more" : caption;
  return (
    <div className="mx-auto mt-4 w-full max-w-[260px] overflow-hidden rounded-[28px] border-[6px] border-ink bg-white">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <PlatformIcon platform={p} size={24} />
        <span className="text-sm font-bold">Your account</span>
      </div>
      <div className="flex aspect-[4/5] items-center justify-center bg-paper">
        {media ? (
          media.type === "video" ? (
            <video src={media.url} className="h-full w-full object-cover" muted autoPlay loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.url} alt="" className="h-full w-full object-cover" />
          )
        ) : platform === "youtube" ? (
          <Film size={36} className="text-ink-faint" />
        ) : (
          <span className="px-6 text-center text-sm text-ink-faint">Your photo or video shows here</span>
        )}
      </div>
      <div className="px-3 py-3 text-sm">
        {platform === "youtube" && <p className="mb-1 font-bold">{title || caption.split("\n")[0] || "Video title"}</p>}
        <p className="whitespace-pre-wrap break-words text-ink-soft">{shown || "Your caption shows here"}</p>
      </div>
    </div>
  );
}

function Result({ postId, onNew }: { postId: string; onNew: () => void }) {
  const { posts, updateResult } = useStore();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const entries = Object.entries(post.results) as [PlatformId, string][];
  const scheduled = entries.every(([, s]) => s === "scheduled");
  const done = entries.every(([, s]) => s === "posted");
  const sending = entries.some(([, s]) => s === "sending");

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h1 className="font-display text-3xl font-bold">
          {scheduled ? "Scheduled" : done ? "Posted everywhere" : sending ? "Posting…" : "Some apps need another try"}
        </h1>
        <p className="mt-1 text-lg text-ink-soft">
          {scheduled
            ? "We’ll post it at the time you chose. You can change it in Calendar."
            : sending
            ? "You can leave this page — posting continues in the background."
            : done
            ? "Your post is live on every app you chose."
            : "The other apps posted fine."}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {entries.map(([id, s]) => {
            const p = platformById(id);
            return (
              <li key={id} className="flex items-center gap-3 rounded-2xl bg-paper p-3.5">
                <PlatformIcon platform={p} size={36} />
                <span className="flex-1 font-bold">{p.name}</span>
                {s === "sending" && (
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    <Loader2 size={20} className="animate-spin" /> Sending
                  </span>
                )}
                {s === "posted" && (
                  <span className="flex items-center gap-1.5 font-bold text-ok">
                    <CheckCircle2 size={20} /> Posted
                  </span>
                )}
                {s === "scheduled" && <span className="font-bold text-ink-soft">Scheduled</span>}
                {s === "failed" && (
                  <button onClick={() => updateResult(post.id, id, "posted")} className="flex items-center gap-1.5 font-bold text-bad">
                    <XCircle size={20} /> Failed · <RotateCcw size={16} /> Try again
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={onNew} className={`${btn.primary} flex-1`}>
            Create another post
          </button>
          <Link href="/posts" className={`${btn.secondary} flex-1`}>
            See all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
