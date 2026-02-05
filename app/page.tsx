"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Cpu,
  Globe,
  Package,
  Plus,
  QrCode,
  Radio,
  Send,
  Shield,
  Sparkles,
  Terminal,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const skillOptions = [
  {
    id: "browser",
    title: "Browser Pack",
    description: "Globe with wings",
    Icon: Globe
  },
  {
    id: "moltbook",
    title: "Moltbook",
    description: "Digital notebook",
    Icon: BookOpen
  }
];

const cockpitSkills = [
  { title: "Navigation Core", Icon: Radio, status: "online" },
  { title: "Threat Shield", Icon: Shield, status: "online" },
  { title: "Telemetry Boost", Icon: Zap, status: "boost" },
  { title: "Inference Cache", Icon: Cpu, status: "online" },
  { title: "Spark Module", Icon: Sparkles, status: "warm" },
  { title: "Payload Handler", Icon: Package, status: "online" }
];

const sanitizedLogStream = [
  "Received request: \"Check tech news\"",
  "Browsing TechCrunch...",
  "Summarizing top three headlines...",
  "Drafting Telegram response...",
  "Summary sent to Telegram.",
  "Monitoring next input...",
  "New task detected: \"Scan product hunt\"",
  "Extracting highlights...",
  "Dispatching update..."
];

const rawLogStream = [
  "[agent] GET https://techcrunch.com", 
  "[browser] DOM loaded in 1.2s", 
  "[parser] extracted 12 article nodes", 
  "[summarizer] prompt_tokens=642", 
  "[telegram] POST /sendMessage 200 OK", 
  "[telemetry] heartbeat=stable", 
  "[agent] idle"
];

const bootBase = [
  "Allocating neural resources...",
  "Injecting Browser Skill Pack...",
  "Injecting Moltbook...",
  "Waking up OpenClaw...",
  "Linking telemetry...",
  "Synchronizing cockpit HUD..."
];

export default function Home() {
  const [phase, setPhase] = useState<"hangar" | "booting" | "cockpit">("hangar");
  const [plan, setPlan] = useState<"byok" | "pro">("byok");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["browser", "moltbook"]);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [godMode, setGodMode] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([
    "System ready. Standing by for command..."
  ]);

  const bootScript = useMemo(() => {
    return bootBase.map((line) => {
      if (line.includes("Browser") && !selectedSkills.includes("browser")) {
        return "Skipping Browser Skill Pack... [SKIP]";
      }
      if (line.includes("Moltbook") && !selectedSkills.includes("moltbook")) {
        return "Skipping Moltbook... [SKIP]";
      }
      return `${line} [OK]`;
    });
  }, [selectedSkills]);

  useEffect(() => {
    if (phase !== "booting") return;
    setBootLines([]);
    let idx = 0;
    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, bootScript[idx]]);
      idx += 1;
      if (idx >= bootScript.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("cockpit"), 800);
      }
    }, 520);

    return () => clearInterval(interval);
  }, [phase, bootScript]);

  useEffect(() => {
    if (phase !== "cockpit") return;
    let idx = 0;
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const stream = godMode ? rawLogStream : sanitizedLogStream;
        const nextLine = stream[idx % stream.length];
        idx += 1;
        return [...prev.slice(-6), nextLine];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [phase, godMode]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((skill) => skill !== id) : [...prev, id]
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "hangar" && (
          <motion.section
            key="hangar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16"
          >
            <div className="hero-grid absolute inset-0 opacity-30" />
            <header className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl border border-pilot/40 bg-void/60">
                  <div className="absolute inset-2 rounded-xl bg-pilot/20" />
                  <div className="absolute inset-0 flex items-center justify-center font-heading text-lg text-pilot">
                    CP
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">ClawPilot</p>
                  <p className="font-heading text-xl text-holo">The Agent Cockpit</p>
                </div>
              </div>
              <div className="hidden items-center gap-4 text-xs text-muted md:flex">
                <span className="rounded-full border border-white/10 px-3 py-2">Arcade-Industrial</span>
                <span className="rounded-full border border-white/10 px-3 py-2">OpenClaw Ready</span>
              </div>
            </header>

            <section className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-muted">Hangar / Configuration</p>
                  <h1 className="font-heading text-4xl text-holo md:text-5xl lg:text-6xl">
                    Your AI Agent. <span className="text-pilot text-glow">Ready in 60 Seconds.</span>
                  </h1>
                  <p className="max-w-xl text-base text-muted md:text-lg">
                    Skip Docker, terminals, and key wrangling. Initialize your pilot in one motion and command it from a
                    premium cockpit.
                  </p>
                </div>

                <Card className="relative overflow-hidden border-white/10 bg-panel bg-void/70">
                  <div className="absolute inset-0 bg-radial-grid opacity-70" />
                  <div className="relative flex flex-col gap-6 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Pricing Toggle</p>
                        <p className="font-heading text-lg">Pilot Loadout</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={cn("text-sm font-semibold", plan === "byok" ? "text-holo" : "text-muted")}>
                            BYOK
                          </p>
                          <p className="text-xs text-muted">Free Trial</p>
                        </div>
                        <Switch
                          checked={plan === "pro"}
                          onCheckedChange={(checked) => setPlan(checked ? "pro" : "byok")}
                          aria-label="Toggle pricing plan"
                        />
                        <div>
                          <p className={cn("text-sm font-semibold", plan === "pro" ? "text-holo" : "text-muted")}>
                            Pro
                          </p>
                          <p className="text-xs text-muted">$10 credits</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {plan === "byok" ? (
                        <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">Bring Your Own Key</p>
                          <p className="mt-2 text-sm text-holo">
                            Plug in any provider. We keep it secure while the cockpit stays free.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-pilot/40 bg-pilot/10 p-4 shadow-glow">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">Turbocharged Credits</p>
                          <p className="mt-2 text-sm text-holo">
                            $10 starter credits + priority routing. Ideal for first launch.
                          </p>
                        </div>
                      )}
                      <div className="rounded-2xl border border-white/10 bg-void/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">Response Layer</p>
                        <p className="mt-2 text-sm text-holo">
                          Sanitized logs by default. Switch to raw telemetry when you want the gritty truth.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Loadout</p>
                      <h2 className="font-heading text-2xl text-holo">Select Skill Cards</h2>
                    </div>
                    <p className="text-xs text-muted">Tap to equip</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {skillOptions.map(({ id, title, description, Icon }) => {
                      const active = selectedSkills.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleSkill(id)}
                          className={cn(
                            "relative rounded-2xl border bg-void/70 p-5 text-left transition-all",
                            active
                              ? "border-pilot/70 shadow-glow"
                              : "border-white/10 hover:border-pilot/40"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-11 w-11 items-center justify-center rounded-xl",
                                    active ? "bg-pilot/20 text-pilot" : "bg-white/5 text-muted"
                                  )}
                                >
                                  <Icon size={20} />
                                </div>
                                <div>
                                  <p className="font-heading text-lg text-holo">{title}</p>
                                  <p className="text-xs text-muted">{description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs uppercase tracking-[0.3em] text-muted">
                              {active ? "Equipped" : "Available"}
                            </div>
                          </div>
                          {active && (
                            <span className="absolute right-4 top-4">
                              <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pilot/60" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-pilot" />
                              </span>
                            </span>
                          )}
                          <div className="mt-4 text-xs text-muted">
                            {active
                              ? "Sonic latch engaged. Audio cue: ping."
                              : "Equip to unlock cockpit routines."}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Card className="relative h-full overflow-hidden border-white/10 bg-panel bg-void/80 p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">Launch</p>
                    <h2 className="font-heading text-3xl text-holo">Ignition Sequence Start</h2>
                    <p className="text-sm text-muted">
                      We spin up your pilot, connect telemetry, and unlock the cockpit. No terminal screens. No cryptic
                      errors.
                    </p>
                    <div className="rounded-2xl border border-white/10 bg-void/80 p-4 terminal-text text-xs text-terminal">
                      &gt; Connection stable... [OK]
                      <br />
                      &gt; Telegram conduit ready... [OK]
                      <br />
                      &gt; Flight recorder armed... [OK]
                    </div>
                  </div>
                  <Button
                    className="w-full py-5 text-base"
                    onClick={() => setPhase("booting")}
                  >
                    INITIALIZE PILOT
                  </Button>
                  <p className="text-center text-xs text-muted">No credit card required. Eject anytime.</p>
                </div>
              </Card>
            </section>
          </motion.section>
        )}

        {phase === "booting" && (
          <motion.section
            key="booting"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 px-6"
          >
            <div className="scanlines relative w-full max-w-2xl rounded-2xl border border-white/10 bg-panel bg-void/80 p-8 shadow-glow">
              <div className="mb-6 flex items-center gap-3">
                <Terminal className="text-pilot" size={22} />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Boot Sequence</p>
                  <p className="font-heading text-xl text-holo">Ignition Sequence Start</p>
                </div>
              </div>
              <div className="terminal-text space-y-3 text-sm text-terminal">
                {bootLines.map((line, index) => (
                  <motion.p
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    &gt; {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {phase === "cockpit" && (
          <motion.section
            key="cockpit"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12"
          >
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl border border-pilot/40 bg-void/60">
                  <div className="absolute inset-2 rounded-xl bg-pilot/20" />
                  <div className="absolute inset-0 flex items-center justify-center font-heading text-lg text-pilot">
                    CP
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Cockpit</p>
                  <p className="font-heading text-xl text-holo">Red Crab Pilot</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-void/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-holo">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pilot/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pilot" />
                </span>
                SYSTEM ONLINE
              </div>

              <div className="rounded-full border border-white/10 bg-void/70 px-4 py-2 text-xs text-muted">
                {plan === "pro" ? "Credits: $9.40" : "API Link: Active"}
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Comm Link</p>
                      <h3 className="font-heading text-2xl text-holo">Open Channel</h3>
                    </div>
                    <Send className="text-pilot" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      <p className="text-sm text-muted">
                        Scan the QR to link Telegram. Your pilot responds instantly from the channel.
                      </p>
                      <Button asChild className="w-full">
                        <a href="https://t.me/ClawPilot" target="_blank" rel="noreferrer">
                          Open Channel
                        </a>
                      </Button>
                      <p className="text-xs text-muted">Connection encrypted. Connection severed status will alert.</p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="glow-ring flex h-40 w-40 items-center justify-center rounded-2xl border border-pilot/40 bg-void/70">
                        <div className="grid h-28 w-28 grid-cols-6 gap-1">
                          {Array.from({ length: 36 }).map((_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "h-3 w-3 rounded-sm",
                                index % 3 === 0 || index % 5 === 0 ? "bg-pilot" : "bg-white/10"
                              )}
                            />
                          ))}
                        </div>
                        <QrCode className="absolute right-3 top-3 text-pilot/70" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Flight Recorder</p>
                      <h3 className="font-heading text-2xl text-holo">Sanitized Logs</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      God Mode
                      <Switch checked={godMode} onCheckedChange={setGodMode} aria-label="Toggle God Mode" />
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl border border-white/10 bg-void/80 p-4">
                    <div className="space-y-3 text-sm">
                      {logLines.map((line, index) => (
                        <div key={`${line}-${index}`} className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-terminal" />
                          <div className={cn("text-holo", godMode && "terminal-text text-terminal")}>
                            <span className="text-xs uppercase tracking-[0.3em] text-muted">
                              {godMode ? "Telemetry" : "Pilot"}
                            </span>
                            <p>{line}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    Sanitized by default. Enable God Mode for raw code logs.
                  </p>
                </div>
              </Card>
            </div>

            <Card className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-radial-grid opacity-60" />
              <div className="relative flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">Skill Matrix</p>
                    <h3 className="font-heading text-2xl text-holo">Installed Systems</h3>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full border border-pilot/50 bg-pilot/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-holo transition hover:border-pilot">
                        <Plus size={14} /> Add Skill
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted">Marketplace</p>
                          <h4 className="font-heading text-2xl text-holo">App Store for Agent Skills</h4>
                          <p className="text-sm text-muted">
                            Install premium modules to expand your pilot. Each install auto-calibrates with your cockpit.
                          </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {[
                            { title: "Signal Scraper", Icon: RadarIcon, tag: "Trending" },
                            { title: "Code Synth", Icon: Cpu, tag: "New" },
                            { title: "Threat Scan", Icon: Shield, tag: "Secure" },
                            { title: "Pulse Monitor", Icon: Zap, tag: "Realtime" }
                          ].map(({ title, Icon, tag }) => (
                            <div key={title} className="rounded-2xl border border-white/10 bg-void/70 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-terminal">
                                    <Icon size={18} />
                                  </div>
                                  <div>
                                    <p className="font-heading text-base text-holo">{title}</p>
                                    <p className="text-xs text-muted">{tag}</p>
                                  </div>
                                </div>
                                <button className="rounded-full border border-terminal/40 bg-terminal/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-terminal">
                                  Install
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cockpitSkills.map(({ title, Icon, status }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-void/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-terminal">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-heading text-base text-holo">{title}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">{status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-terminal">
                          <span className="h-2 w-2 rounded-full bg-terminal" />
                          synced
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function RadarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M12 12l4-4" />
    </svg>
  );
}
