"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PLATFORMS, PlatformId } from "@/lib/platforms";
import { PageTitle, PlatformIcon, btn } from "@/components/ui";

const ZONES = ["Asia/Dubai", "Asia/Karachi", "Asia/Riyadh", "Europe/London", "America/New_York", "America/Chicago"];

export default function SettingsPage() {
  const { settings, saveSettings, showToast } = useStore();
  const [s, setS] = useState(settings);

  const toggle = (id: PlatformId) =>
    setS((x) => ({
      ...x,
      defaultPlatforms: x.defaultPlatforms.includes(id) ? x.defaultPlatforms.filter((p) => p !== id) : [...x.defaultPlatforms, id],
    }));

  return (
    <>
      <PageTitle title="Settings" sub="Set it once. Every new post uses these." />

      <div className="flex max-w-2xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6">
          <label htmlFor="tz" className="font-display text-xl font-bold">
            Your time zone
          </label>
          <p className="text-ink-soft">Scheduled posts go out at this local time.</p>
          <select
            id="tz"
            value={s.timezone}
            onChange={(e) => setS({ ...s, timezone: e.target.value })}
            className="mt-3 w-full rounded-2xl border-2 border-line bg-white p-3.5 text-lg"
          >
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </section>

        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-display text-xl font-bold">Apps turned on for new posts</h2>
          <p className="text-ink-soft">You can still change them on each post.</p>
          <div className="mt-4 flex flex-col gap-2">
            {PLATFORMS.map((p) => {
              const on = s.defaultPlatforms.includes(p.id);
              return (
                <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-paper p-3">
                  <PlatformIcon platform={p} size={32} />
                  <span className="flex-1 font-bold">{p.name}</span>
                  <input type="checkbox" checked={on} onChange={() => toggle(p.id)} className="h-6 w-6 accent-[#1C2140]" />
                </label>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6">
          <label htmlFor="dt" className="font-display text-xl font-bold">
            Usual posting time
          </label>
          <p className="text-ink-soft">Filled in for you when you schedule a post.</p>
          <input
            id="dt"
            type="time"
            value={s.defaultTime}
            onChange={(e) => setS({ ...s, defaultTime: e.target.value })}
            className="mt-3 w-full rounded-2xl border-2 border-line p-3.5 text-lg"
          />
        </section>

        <button
          className={`${btn.primary} self-start`}
          onClick={() => {
            saveSettings(s);
            showToast("Settings saved");
          }}
        >
          Save settings
        </button>
      </div>
    </>
  );
}
