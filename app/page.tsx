"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Cpu,
  Globe,
  HelpCircle,
  Layers,
  Package,
  QrCode,
  Radio,
  Rocket,
  Send,
  Shield,
  Sparkles,
  Terminal,
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BootLine = {
  line: string;
  status: "OK" | "SKIP";
  subtext: string;
};

type LogLine = {
  speaker: "Assistant" | "Action" | "Telemetry";
  text: string;
};

const planOptions = [
  {
    id: "starter" as const,
    title: "Starter",
    description: "For people who already have an AI key.",
    price: "$19/month",
    tag: "BYOK",
    features: [
      "One-click OpenClaw setup (no command line)",
      "Power skills pack (core essentials)",
      "Bring your own AI keys (OpenAI / Gemini / Claude)",
      "Cancel anytime"
    ]
  },
  {
    id: "pro" as const,
    title: "Pro",
    description: "For people who want it to work instantly without keys.",
    price: "$39/month",
    tag: "Credits Included",
    features: [
      "Everything in Starter",
      "$10 AI credits included every month",
      "Full power skills pack",
      "Priority support",
      "Cancel anytime"
    ]
  }
];

const skillOptions = [
  {
    id: "browser",
    title: "Browser",
    description: "Real-time web search + automation.",
    Icon: Globe
  },
  {
    id: "memory",
    title: "Memory",
    description: "Long-term memory + templates.",
    Icon: BookOpen
  }
];

const dashboardSkills = [
  { title: "Navigation Core", Icon: Radio },
  { title: "Threat Shield", Icon: Shield },
  { title: "Telemetry Boost", Icon: Zap },
  { title: "Inference Cache", Icon: Cpu },
  { title: "Spark Module", Icon: Sparkles },
  { title: "Payload Handler", Icon: Package }
];

const sanitizedLogStream: LogLine[] = [
  { speaker: "Action", text: "Received request: \"Check tech news\"" },
  { speaker: "Action", text: "Browsing TechCrunch..." },
  { speaker: "Action", text: "Summarizing top three headlines..." },
  { speaker: "Action", text: "Drafting Telegram response..." },
  { speaker: "Assistant", text: "Summary sent to Telegram." },
  { speaker: "Assistant", text: "Monitoring next input..." },
  { speaker: "Action", text: "New task detected: \"Scan product hunt\"" },
  { speaker: "Action", text: "Extracting highlights..." },
  { speaker: "Assistant", text: "Dispatching update..." }
];

const rawLogStream: LogLine[] = [
  { speaker: "Telemetry", text: "[agent] GET https://techcrunch.com" },
  { speaker: "Telemetry", text: "[browser] DOM loaded in 1.2s" },
  { speaker: "Telemetry", text: "[parser] extracted 12 article nodes" },
  { speaker: "Telemetry", text: "[summarizer] prompt_tokens=642" },
  { speaker: "Telemetry", text: "[telegram] POST /sendMessage 200 OK" },
  { speaker: "Telemetry", text: "[telemetry] heartbeat=stable" },
  { speaker: "Telemetry", text: "[agent] idle" }
];

const bootSteps = [
  {
    id: "alloc",
    line: "Allocating neural resources...",
    subtext: "Reserving compute nodes and inference lanes."
  },
  {
    id: "browser",
    line: "Injecting Browser Skill Pack...",
    subtext: "Configuring headless Chrome for web tasks."
  },
  {
    id: "memory",
    line: "Injecting Memory Pack...",
    subtext: "Loading long-term memory and templates."
  },
  {
    id: "wake",
    line: "Waking up OpenClaw...",
    subtext: "Provisioning your dedicated private instance."
  },
  {
    id: "telemetry",
    line: "Linking telemetry...",
    subtext: "Establishing secure encrypted connection."
  },
  {
    id: "sync",
    line: "Synchronizing dashboard UI...",
    subtext: "Calibrating overlays and system feeds."
  }
];

const initialLog: LogLine = {
  speaker: "Assistant",
  text: "Systems nominal. I’m standing by in Telegram for your first command."
};

const valueCards = [
  {
    title: "Hosted OpenClaw",
    body: "Always-on instance, managed updates.",
    Icon: Layers
  },
  {
    title: "Skills",
    body: "Add Browser + Memory modules in one click.",
    Icon: Sparkles
  },
  {
    title: "Telegram Control",
    body: "Send commands and get outputs where you work.",
    Icon: Send
  }
];

const howItWorks = [
  {
    title: "Choose a plan",
    body: "Starter or Pro — both hosted 24/7."
  },
  {
    title: "Choose skills",
    body: "Browser + Memory modules in one tap."
  },
  {
    title: "Deploy → Open Dashboard",
    body: "Connect Telegram and send your first command."
  }
];

export default function Home() {
  const [phase, setPhase] = useState<"setup" | "deploying" | "dashboard">("setup");
  const [plan, setPlan] = useState<"starter" | "pro" | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["browser", "memory"]);
  const [bootLines, setBootLines] = useState<BootLine[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const [logLines, setLogLines] = useState<LogLine[]>([initialLog]);
  const [showAssistant, setShowAssistant] = useState(true);
  const [setupFocus, setSetupFocus] = useState(false);

  const setupRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const bootScript = useMemo(() => {
    return bootSteps.map((step) => {
      if (step.id === "browser" && !selectedSkills.includes("browser")) {
        return {
          line: "Skipping Browser Skill Pack...",
          status: "SKIP" as const,
          subtext: "Skill not selected in setup."
        };
      }
      if (step.id === "memory" && !selectedSkills.includes("memory")) {
        return {
          line: "Skipping Memory Pack...",
          status: "SKIP" as const,
          subtext: "Skill not selected in setup."
        };
      }
      return {
        line: step.line,
        status: "OK" as const,
        subtext: step.subtext
      };
    });
  }, [selectedSkills]);

  useEffect(() => {
    if (phase !== "deploying") return;
    setBootLines([]);
    setBootComplete(false);
    let idx = 0;
    const interval = setInterval(() => {
      const next = bootScript[idx];
      if (!next) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 200);
        return;
      }
      setBootLines((prev) => [...prev, next]);
      idx += 1;
      if (idx >= bootScript.length) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 400);
      }
    }, 520);

    return () => clearInterval(interval);
  }, [phase, bootScript]);

  useEffect(() => {
    if (phase !== "dashboard") return;
    let idx = 0;
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const stream = godMode ? rawLogStream : sanitizedLogStream;
        const nextLine = stream[idx % stream.length];
        idx += 1;
        const tail = [...prev.slice(1), nextLine].slice(-6);
        return [initialLog, ...tail];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [phase, godMode]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((skill) => skill !== id) : [...prev, id]
    );
  };

  const handlePlanSelect = (id: "starter" | "pro") => {
    setPlan(id);
  };

  const handleHeroCTA = () => {
    setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSetupFocus(true);
    setTimeout(() => setSetupFocus(false), 1600);
  };

  const handlePreviewCTA = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeCardClass = "border-pilot/60 shadow-[0_0_10px_rgba(230,57,70,0.1)]";
  const selectedPlan = planOptions.find((option) => option.id === plan) ?? null;
  const deployReady = Boolean(plan);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.section
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-14 px-6 py-16"
          >
            <div className="hero-grid absolute inset-0 opacity-30" />
            <header className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl border border-pilot/40 bg-void/60">
                  <Image
                    src="/quickclaw-logo.png"
                    alt="QuickClaw logo"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <div>
                  <p className="font-heading text-lg text-holo">QuickClaw</p>
                </div>
              </div>
              <div className="hidden items-center gap-4 text-xs text-muted md:flex">
                <span className="rounded-full border border-white/10 px-3 py-2">Built for OpenClaw</span>
                <span className="rounded-full border border-white/10 px-3 py-2">Cyber-Minimal UI</span>
                <a
                  href="https://x.com/usequickclaw"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-3 py-2 text-holo transition hover:border-pilot/40"
                >
                  Follow on X
                </a>
              </div>
            </header>

            <section className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-muted">Setup</p>
                  <h1 className="font-heading text-4xl text-holo md:text-5xl lg:text-6xl">
                    Launch your OpenClaw and add skills in <span className="text-pilot text-glow">60 seconds.</span>
                  </h1>
                  <p className="max-w-xl text-base text-muted md:text-lg">
                    QuickClaw hosts your OpenClaw agent 24/7—deploy once, connect Telegram, and manage everything from a
                    clean dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-muted">
                  {[
                    "No Docker",
                    "No VPS",
                    "No Terminal Setup",
                    "Starter $19 / Pro $39"
                  ].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="px-6 py-4 text-sm" onClick={handleHeroCTA}>
                    DEPLOY OPENCLAW
                  </Button>
                  <button
                    onClick={handlePreviewCTA}
                    className="rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-muted transition hover:border-pilot/40"
                  >
                    See Dashboard Preview
                  </button>
                </div>
                <a
                  href="https://x.com/usequickclaw"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs uppercase tracking-[0.3em] text-muted md:hidden"
                >
                  Follow on X
                </a>
              </div>

              <div className="space-y-4">
                <Card className="relative overflow-hidden border-white/10 bg-panel bg-void/80 p-6">
                  <div className="absolute inset-0 bg-radial-grid opacity-60" />
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">What You Get</p>
                        <p className="font-heading text-2xl text-holo">Simple, Managed, Ready</p>
                      </div>
                      <Rocket className="text-pilot" />
                    </div>
                    <div className="space-y-3">
                      {valueCards.map(({ title, body, Icon }) => (
                        <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-void/70 p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-terminal">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-heading text-base text-holo">{title}</p>
                            <p className="text-xs text-muted">{body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
                <Card className="relative overflow-hidden border-white/10 bg-panel bg-void/80 p-6">
                  <div className="absolute inset-0 bg-radial-grid opacity-50" />
                  <div className="relative space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">How It Works</p>
                    <div className="space-y-3">
                      {howItWorks.map((step, index) => (
                        <div key={step.title} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-void/80 text-xs text-holo">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-heading text-base text-holo">{step.title}</p>
                            <p className="text-xs text-muted">{step.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section
              ref={previewRef}
              className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
            >
              <Card className="relative overflow-hidden border-white/10 bg-panel bg-void/80 p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-50" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Dashboard Preview</p>
                  <div className="rounded-2xl border border-white/10 bg-void/80 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
                      <span>System Online</span>
                      <span>Credits: $9.40</span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-void/70 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Connect Telegram</p>
                        <p className="mt-2 text-sm text-holo">Scan to connect + open channel</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-void/70 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Live Logs</p>
                        <p className="mt-2 text-sm text-holo">Sanitized by default. God Mode ready.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="relative overflow-hidden border-white/10 bg-panel bg-void/80 p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-50" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Why QuickClaw</p>
                  <p className="text-sm text-muted">
                    We remove infra work so you can focus on the agent itself. Deploy once, connect Telegram, and control
                    everything from a clean dashboard.
                  </p>
                  <div className="space-y-2 text-xs text-muted">
                    {[
                      "No Docker or VPS to manage",
                      "Security and updates handled",
                      "Clear logs and skill management"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-terminal" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </section>

            <section
              ref={setupRef}
              className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
            >
              <div className="space-y-8">
                <div className={cn("space-y-4", setupFocus && "animate-pulse")}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 1: Choose a plan</p>
                  <h2 className="font-heading text-2xl text-holo">Starter or Pro</h2>
                </div>

                <div className="grid gap-4">
                  {planOptions.map((option) => {
                    const active = plan === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handlePlanSelect(option.id)}
                        className={cn(
                          "rounded-2xl border bg-void/70 p-5 text-left transition-all",
                          active
                            ? cn("border-pilot/70 bg-pilot/10", activeCardClass)
                            : "border-white/10 hover:border-pilot/40"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">{option.tag}</p>
                            <p className="font-heading text-2xl text-holo">{option.title}</p>
                          </div>
                          <div className="text-xs uppercase tracking-[0.3em] text-muted">
                            {active ? "Selected" : "Select"}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted">{option.description}</p>
                        <ul className="mt-4 space-y-2 text-xs text-muted">
                          {option.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="mt-0.5 text-terminal" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-holo">
                          <span>Monthly</span>
                          <span className="text-pilot">{option.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Step 2: Choose skills</p>
                      <h2 className="font-heading text-2xl text-holo">Browser + Memory</h2>
                    </div>
                    <p className="text-xs text-muted">Tap to toggle</p>
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
                              ? cn("border-pilot/70 bg-pilot/10", activeCardClass)
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
                              {active ? "On" : "Off"}
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
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Card className="relative h-full overflow-hidden border-white/10 bg-panel bg-void/80 p-6 lg:sticky lg:top-10">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">Deploy Summary</p>
                    <h2 className="font-heading text-2xl text-holo">Ready to Deploy</h2>
                    <div className="space-y-2 text-sm text-muted">
                      <p>
                        <span className="text-holo">Selected plan:</span>{" "}
                        {selectedPlan ? `${selectedPlan.title} (${selectedPlan.price})` : "Choose a plan"}
                      </p>
                      <p>
                        <span className="text-holo">Skills:</span>{" "}
                        {selectedSkills.length ? selectedSkills.map((id) => (id === "browser" ? "Browser" : "Memory")).join(", ") : "None"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-void/80 p-4 text-xs text-muted">
                      <p className="uppercase tracking-[0.3em] text-muted">What happens next</p>
                      <ul className="mt-3 space-y-2">
                        <li>We deploy your OpenClaw instance</li>
                        <li>You open the dashboard</li>
                        <li>You connect Telegram and send your first command</li>
                      </ul>
                    </div>
                  </div>
                  <Button
                    className={cn(
                      "w-full py-5 text-base",
                      deployReady && "shadow-[0_0_25px_rgba(230,57,70,0.35)]"
                    )}
                    onClick={() => setPhase("deploying")}
                    disabled={!deployReady}
                  >
                    DEPLOY OPENCLAW
                  </Button>
                  <p className="text-center text-xs text-muted">No credit card required. Cancel anytime.</p>
                </div>
              </Card>
            </section>
          </motion.section>
        )}

        {phase === "deploying" && (
          <motion.section
            key="deploying"
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
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">Deploying OpenClaw</p>
                  <p className="font-heading text-xl text-holo">Provisioning your instance</p>
                </div>
              </div>
              <div className="terminal-text space-y-4 text-sm text-terminal">
                {bootLines.map((line, index) => {
                  if (!line) return null;
                  return (
                    <motion.div
                      key={`${line.line}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1"
                    >
                      <p>
                        &gt; {line.line} [{line.status}]
                      </p>
                      <p className="text-xs text-muted">{line.subtext}</p>
                    </motion.div>
                  );
                })}
              </div>
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <Button className="w-full py-5 text-base" onClick={() => setPhase("dashboard")}>OPEN DASHBOARD</Button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {phase === "dashboard" && (
          <motion.section
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12"
          >
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl border border-pilot/40 bg-void/60">
                  <Image
                    src="/quickclaw-logo.png"
                    alt="QuickClaw logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">QuickClaw</p>
                  <p className="font-heading text-xl text-holo">Dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-void/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-holo">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pilot/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pilot" />
                </span>
                SYSTEM ONLINE
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-void/70 px-4 py-2 text-xs text-muted">
                <span>{plan === "pro" ? "Credits: $9.40" : "Credits: $0.00"}</span>
                <span className="text-holo">•</span>
                <span>API Link: Active</span>
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="absolute inset-0 rounded-2xl border border-pilot/40 animate-pulse" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-pilot">STEP 1: CONNECT TELEGRAM</p>
                      <h3 className="font-heading text-2xl text-holo">Open Telegram</h3>
                    </div>
                    <Send className="text-pilot" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      <p className="text-sm text-muted">
                        Scan the QR to link Telegram. Your agent responds instantly from the channel.
                      </p>
                      <Button className="w-full" type="button">
                        Open Telegram
                      </Button>
                      <p className="text-xs text-muted">Telegram link appears after deploy.</p>
                      <p className="text-xs text-muted">Connection encrypted. You will be alerted if it disconnects.</p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Scan to Connect</p>
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
                </div>
              </Card>

              <Card className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-radial-grid opacity-60" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">STEP 2: LOGS</p>
                      <h3 className="font-heading text-2xl text-holo">Sanitized Logs</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <div className="flex items-center gap-1">
                        God Mode
                        <HelpCircle
                          size={14}
                          className="text-muted"
                          title="View raw system telemetry and Docker logs."
                        />
                      </div>
                      <Switch checked={godMode} onCheckedChange={setGodMode} aria-label="Toggle God Mode" />
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl border border-white/10 bg-void/80 p-4">
                    <div className="space-y-3 text-sm">
                      {logLines.map((line, index) => (
                        <div key={`${line.text}-${index}`} className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-terminal" />
                          <div className={cn("text-holo", godMode && "terminal-text text-terminal")}>
                            <span className="text-xs uppercase tracking-[0.3em] text-muted">
                              [{line.speaker.toUpperCase()}]
                            </span>
                            <p>{line.text}</p>
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
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">STEP 3: SKILLS</p>
                    <h3 className="font-heading text-2xl text-holo">Installed Modules</h3>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full border border-pilot/50 bg-pilot/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-holo transition hover:border-pilot">
                        <Layers size={14} /> Add Skill
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted">Skill Marketplace</p>
                          <h4 className="font-heading text-2xl text-holo">Add New Skills</h4>
                          <p className="text-sm text-muted">
                            Install premium modules to expand what your OpenClaw can do. Each install auto-calibrates with
                            your dashboard.
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
                  {dashboardSkills.map(({ title, Icon }) => (
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
                            <p className="text-xs uppercase tracking-[0.3em] text-muted">running</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-terminal/40 bg-terminal/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-terminal">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal/70" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal" />
                          </span>
                          Status: Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {showAssistant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl border border-pilot/40 bg-void/90 p-4 shadow-[0_0_20px_rgba(230,57,70,0.25)]"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 rounded-full bg-pilot/20">
                    <Image
                      src="/quickclaw-logo.png"
                      alt="QuickClaw logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">QuickClaw Assistant</p>
                    <p className="font-heading text-base text-holo">Setup Check</p>
                    <p className="mt-2 text-xs text-muted">
                      Connect Telegram, then send your first command to verify everything’s live.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAssistant(false)}
                    className="ml-auto text-muted transition hover:text-holo"
                    aria-label="Dismiss assistant"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
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
