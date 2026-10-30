"use client";

import { CheckCircle2, AlertTriangle, PlugZap } from "lucide-react";
import { useStore } from "@/lib/store";
import { PLATFORMS } from "@/lib/platforms";
import { PageTitle, PlatformIcon, btn } from "@/components/ui";

export default function AccountsPage() {
  const { accounts, setAccount, showToast } = useStore();
  const ready = accounts.filter((a) => a.connected && !a.needsReconnect).length;

  return (
    <>
      <PageTitle title="My apps" sub={`${ready} of ${PLATFORMS.length} apps ready to post`} />

      <ul className="grid gap-4 md:grid-cols-2">
        {PLATFORMS.map((p) => {
          const a = accounts.find((x) => x.id === p.id)!;
          const state = !a.connected ? "off" : a.needsReconnect ? "expired" : "ok";
          return (
            <li key={p.id} className="flex flex-col rounded-3xl border border-line bg-white p-5">
              <div className="flex items-center gap-4">
                <PlatformIcon platform={p} size={52} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold">{p.name}</h2>
                  {state === "ok" && (
                    <p className="flex items-center gap-1.5 font-bold text-ok">
                      <CheckCircle2 size={18} /> Connected as {a.handle}
                    </p>
                  )}
                  {state === "expired" && (
                    <p className="flex items-center gap-1.5 font-bold text-warn">
                      <AlertTriangle size={18} /> Login expired — log in again
                    </p>
                  )}
                  {state === "off" && <p className="text-ink-soft">Not connected</p>}
                </div>
              </div>
              <p className="mt-3 text-ink-soft">{p.loginNote}</p>
              <div className="mt-5 flex gap-3">
                {state === "off" && (
                  <button
                    className={`${btn.primary} flex-1`}
                    onClick={() => {
                      setAccount(p.id, { connected: true, needsReconnect: false, handle: "@itsolutionnyc" });
                      showToast(`${p.name} connected`);
                    }}
                  >
                    <PlugZap size={20} /> Connect {p.name}
                  </button>
                )}
                {state === "expired" && (
                  <button
                    className={`${btn.primary} flex-1`}
                    onClick={() => {
                      setAccount(p.id, { needsReconnect: false });
                      showToast(`${p.name} logged in again`);
                    }}
                  >
                    Log in again
                  </button>
                )}
                {state !== "off" && (
                  <button
                    className={`${btn.secondary} ${state === "ok" ? "" : "flex-none"}`}
                    onClick={() => {
                      setAccount(p.id, { connected: false, needsReconnect: false, handle: undefined });
                      showToast(`${p.name} disconnected`);
                    }}
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-2xl text-ink-soft">
        We never see your passwords. Each app gives SocialSpot a safe key to post for you, and you can remove it here at any time.
      </p>
    </>
  );
}
