"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Activity,
  Sparkles,
  ArrowRight,
  Waves,
  Brain,
  Moon,
  ChevronDown,
  Menu,
  Lock,
  Mail,
  Calendar,
  Volume2,
  Clock,
  Check,
  TreePine,
  Timer,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LightPillar } from "@/components/effects/LightPillar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import {
  TechFrame,
  HudPanel,
  DataDisplay,
  CornerOrnament,
  SectionDivider,
} from "@/components/ui/frame";

// Custom hook for Supabase session
function useSupabaseSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { isAuthenticated, isLoading };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const cycles = [
  {
    name: "Physical",
    element: "Body",
    icon: Activity,
    color: "ember",
    bg: "bg-ember-500/10",
    border: "border-ember-500/20",
    text: "text-ember-400",
    iconColor: "text-ember-500",
    glow: "shadow-ember-500/10",
    description: "23-day cycle governing strength, energy, and physical vitality",
    days: 23,
  },
  {
    name: "Emotional",
    element: "Heart",
    icon: Waves,
    color: "ocean",
    bg: "bg-ocean-500/10",
    border: "border-ocean-500/20",
    text: "text-ocean-400",
    iconColor: "text-ocean-500",
    glow: "shadow-ocean-500/10",
    description: "28-day cycle governing mood, creativity, and emotional flow",
    days: 28,
  },
  {
    name: "Intellectual",
    element: "Mind",
    icon: Brain,
    color: "solar",
    bg: "bg-solar-500/10",
    border: "border-solar-500/20",
    text: "text-solar-400",
    iconColor: "text-solar-500",
    glow: "shadow-solar-500/10",
    description: "33-day cycle governing logic, memory, and mental clarity",
    days: 33,
  },
  {
    name: "Spiritual",
    element: "Spirit",
    icon: Moon,
    color: "lunar",
    bg: "bg-lunar-500/10",
    border: "border-lunar-500/20",
    text: "text-lunar-400",
    iconColor: "text-lunar-500",
    glow: "shadow-lunar-500/10",
    description: "21-day cycle governing intuition, awareness, and inner peace",
    days: 21,
  },
] as const;

const features = [
  {
    title: "12 Sacred Chapters",
    description: "Unlock wisdom tied to your biorhythm cycles through 12 somatic canticles",
    icon: BookOpen,
  },
  {
    title: "Cycle Tracking",
    description: "Monitor your physical, emotional, intellectual, and spiritual rhythms",
    icon: Activity,
  },
  {
    title: "Personalized Journey",
    description: "Content unlocks based on your unique biorhythm patterns and progress",
    icon: Sparkles,
  },
] as const;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chapters", label: "Chapters" },
  { href: "/about", label: "About" },
];

// Auth Modal Component
function AuthModal({
  trigger,
  title = "Sign In Required",
  description = "Please sign in or create an account to access this feature."
}: {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/auth/login">
            <Button className="w-full gap-2">
              <Lock className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Create Account
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Navigation Header Component
function NavigationHeader() {
  const { isLoading, isAuthenticated } = useSupabaseSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wider uppercase">
            Somatic Canticles
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-6 pt-6">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <SheetClose asChild>
                    <Link href="/dashboard">
                      <Button className="w-full gap-2">
                        <Activity className="h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/auth/register">
                        <Button className="w-full gap-2">
                          <Sparkles className="h-4 w-4" />
                          Sign Up
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

// What Are Biorhythms Section
function BiorhythmsExplainerSection() {
  const orbitNodePositions = [
    "top-1 left-1/2 -translate-x-1/2",
    "right-1 top-1/2 -translate-y-1/2",
    "bottom-1 left-1/2 -translate-x-1/2",
    "left-1 top-1/2 -translate-y-1/2",
  ] as const;

  return (
    <section className="relative border-t border-border/50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div variants={itemVariants} className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase text-amber-400/90">
            Arcane Systems Brief
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-metallic text-balance sm:text-3xl">
            The Runic Rhythm Engine
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground text-pretty">
            Your birth pulse powers four rotating cadence streams. Each stream rises,
            dips, and peaks on its own interval, shaping when chapters unlock and how
            each day feels in practice.
          </p>
        </motion.div>

        <TechFrame variant="tech" className="mx-auto max-w-5xl overflow-hidden p-0">
          <CornerOrnament position="top-left" className="text-cyan-400/60" />
          <CornerOrnament position="top-right" className="text-cyan-400/60" />
          <CornerOrnament position="bottom-left" className="text-cyan-400/60" />
          <CornerOrnament position="bottom-right" className="text-cyan-400/60" />

          <div className="grid gap-2 border-b border-cyan-500/20 bg-metal-900/90 px-4 py-3 text-xs font-mono text-muted-foreground sm:grid-cols-3">
            <span>CORE STATUS: SYNCHRONIZED</span>
            <span className="sm:text-center">PROTOCOL: SOMATIC-CANTICLES-IV</span>
            <span className="sm:text-right">SIGNAL: QUADRANT STABLE</span>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-cyan-500/20 p-5 sm:p-8 lg:border-r lg:border-b-0">
              <p className="text-xs font-semibold uppercase text-cyan-300/90">
                Orbital Cycle Map
              </p>
              <div className="relative mx-auto mt-6 size-[18rem] sm:size-[21rem]">
                <div className="absolute inset-6 rounded-full border border-metal-700/90" />
                <div className="absolute inset-12 rounded-full border border-cyan-500/30" />
                <div className="absolute inset-20 rounded-full border border-amber-500/30" />
                <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-metal-700/80" />
                <div className="absolute top-1/2 left-6 h-px w-[calc(100%-3rem)] -translate-y-1/2 bg-metal-700/80" />

                <div className="absolute inset-[37%] flex items-center justify-center rounded-full border border-amber-500/40 bg-metal-900/90 p-2 text-center">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-amber-300">Birth Pulse</p>
                    <p className="mt-1 text-xs font-mono text-metallic">Origin Node</p>
                  </div>
                </div>

                {cycles.map((cycle, index) => {
                  const Icon = cycle.icon;
                  return (
                    <motion.div
                      key={cycle.name}
                      variants={itemVariants}
                      className={`absolute ${orbitNodePositions[index]} w-28 rounded-md border ${cycle.border} ${cycle.bg} p-2 text-center`}
                    >
                      <div className="mx-auto flex size-7 items-center justify-center rounded-md border border-current/20 bg-metal-900/50">
                        <Icon className={`h-4 w-4 ${cycle.iconColor}`} />
                      </div>
                      <p className={`mt-1.5 text-xs font-semibold ${cycle.text}`}>{cycle.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{cycle.days}d cadence</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3">
                  <p className="text-xs font-semibold text-cyan-300">Wave Rule</p>
                  <p className="mt-1 text-xs text-muted-foreground text-pretty">
                    Every stream oscillates through peak, neutral, and critical thresholds.
                  </p>
                </div>
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="text-xs font-semibold text-amber-300">Unlock Rule</p>
                  <p className="mt-1 text-xs text-muted-foreground text-pretty">
                    Chapters open when your active stream meets required threshold windows.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-metal-900/70 p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase text-amber-300/90">
                Cycle Codex
              </p>
              <div className="mt-4 space-y-3">
                {cycles.map((cycle) => {
                  const Icon = cycle.icon;
                  return (
                    <div
                      key={`${cycle.name}-codex`}
                      className={`rounded-md border ${cycle.border} ${cycle.bg} p-3`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${cycle.iconColor}`} />
                        <p className={`text-sm font-semibold ${cycle.text}`}>{cycle.name}</p>
                        <span className="ml-auto text-xs font-mono text-muted-foreground tabular-nums">
                          {cycle.days}d
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground text-pretty">
                        {cycle.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-cyan-500/20 bg-metal-900/50 p-4 sm:grid-cols-3 sm:p-6">
            <div className="rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-cyan-300">
                <Waves className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase">Signal Pattern</p>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                A sinusoidal rhythm creates predictable windows for rest, focus, and force.
              </p>
            </div>

            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-amber-300">
                <Sparkles className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase">Peak Windows</p>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                Favor chapter work when one or more streams enter an upward alignment.
              </p>
            </div>

            <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-rose-300">
                <Timer className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase">Timeline Lock</p>
              </div>
              <p className="text-xs text-muted-foreground text-pretty">
                Birthdate remains the anchor that calibrates every future cycle projection.
              </p>
            </div>
          </div>
        </TechFrame>
      </div>
    </section>
  );
}

// Chapter Progression Section
function ChapterProgressionSection() {
  const chapters = [
    { num: 1, title: "The Beginning", status: "unlocked", delay: "Immediate" },
    { num: 2, title: "The Awakening", status: "unlocked", delay: "3-7 days" },
    { num: 3, title: "The Journey", status: "locked", delay: "Peak required" },
    { num: 4, title: "The Discovery", status: "locked", delay: "Peak required" },
    { num: 5, title: "The Challenge", status: "locked", delay: "Peak required" },
    { num: 6, title: "The Transformation", status: "locked", delay: "Peak required" },
  ];

  return (
    <section className="relative border-t border-border/50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-metallic">
            Chapter Progression
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Chapters unlock based on your biorhythm peaks. Each canticle becomes
            available when your cycles align with the right conditions.
          </p>
        </motion.div>

        {/* Chapter Tree Placeholder */}
        <TechFrame variant="tech" className="mx-auto max-w-4xl">
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />

          {/* ChapterTreeNode Component Placeholder */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Progression Tree</span>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-mono border border-primary/20">
              Interactive
            </span>
          </div>

          {/* Chapter Grid Visualization */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.num}
                variants={itemVariants}
                className={`relative overflow-hidden flex items-center gap-3 rounded-lg border p-3 transition-all duration-300 hover:scale-[1.02] ${chapter.status === "unlocked"
                  ? "border-primary/40 bg-primary/10 shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)]"
                  : "border-border/50 bg-metal-900/20 opacity-60 grayscale"
                  }`}
              >
                {chapter.status === "unlocked" && (
                  <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none" />
                )}

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold border ${chapter.status === "unlocked"
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-muted/20 text-muted-foreground border-border/50"
                    }`}
                >
                  {chapter.status === "unlocked" ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1 relative z-10">
                  <p className={`truncate text-sm font-medium ${chapter.status === "unlocked" ? "text-primary-foreground" : "text-muted-foreground"}`}>
                    <span className="text-[10px] uppercase opacity-70 mr-1.5">CH {chapter.num}</span>
                    {chapter.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {chapter.delay}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Info */}
          <div className="mt-6 grid gap-4 rounded-lg border border-border/50 bg-background/50 p-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-ember-400 font-mono">1</p>
              <p className="text-xs text-muted-foreground">Chapter Unlocks Immediately</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ocean-400 font-mono">3-7</p>
              <p className="text-xs text-muted-foreground">Days for Chapter 2</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-solar-400 font-mono">3-6</p>
              <p className="text-xs text-muted-foreground">Months for Full Journey</p>
            </div>
          </div>
        </TechFrame>
      </div>
    </section>
  );
}

// System Requirements Component
function SystemRequirements() {
  const requirements = [
    { icon: Mail, text: "Valid email address" },
    { icon: Calendar, text: "Birthdate (for biorhythm calculation)" },
    { icon: Volume2, text: "Audio playback capability" },
    { icon: Clock, text: "~20 minutes daily commitment" },
  ];

  return (
    <HudPanel title="System Requirements" icon={<Check className="h-4 w-4" />}>
      <ul className="space-y-3">
        {requirements.map((req) => {
          const Icon = req.icon;
          return (
            <li key={req.text} className="flex items-center gap-3 text-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-muted-foreground">{req.text}</span>
            </li>
          );
        })}
      </ul>
    </HudPanel>
  );
}

// Expected Timeline Component
function ExpectedTimeline() {
  return (
    <HudPanel title="Expected First Unlock" icon={<Timer className="h-4 w-4" />}>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
          <span>
            <strong className="text-foreground">Chapter 1:</strong>{" "}
            <span className="text-muted-foreground">Unlocks immediately upon registration</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean-500" />
          <span>
            <strong className="text-foreground">Chapter 2:</strong>{" "}
            <span className="text-muted-foreground">3-7 days (depends on Physical cycle)</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-solar-500" />
          <span>
            <strong className="text-foreground">Full Journey:</strong>{" "}
            <span className="text-muted-foreground">3-6 months to complete all 12</span>
          </span>
        </li>
      </ul>
    </HudPanel>
  );
}

// Consciousness Sync Station Section
function ConsciousnessSyncSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-metal-900/10">
      <div className="mx-auto max-w-6xl">
        <SectionDivider label="Consciousness Sync Station" className="mb-12" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Audio Canticle Preview */}
          <HudPanel
            title="AUDIO CANTICLES"
            icon={<Volume2 className="h-4 w-4" />}
            variant="tech"
            className="h-full"
          >
            <div className="space-y-6">
              {/* Fake Player */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 opacity-20" />

                <div className="mb-6 flex items-end justify-center gap-1 h-12 text-primary">
                  <div className="w-1 bg-primary/60 h-[40%] animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-1 bg-primary/80 h-[70%] animate-pulse" style={{ animationDelay: "75ms" }} />
                  <div className="w-1 bg-primary h-[100%] animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-1 bg-primary/90 h-[60%] animate-pulse" style={{ animationDelay: "300ms" }} />
                  <div className="w-1 bg-primary/70 h-[80%] animate-pulse" style={{ animationDelay: "75ms" }} />
                  <div className="w-1 bg-primary/50 h-[40%] animate-pulse" style={{ animationDelay: "200ms" }} />
                  <div className="w-1 bg-primary/30 h-[20%] animate-pulse" style={{ animationDelay: "100ms" }} />
                </div>

                <p className="font-mono text-sm text-primary mb-2 relative z-10">
                  [▶ PREVIEW] Chapter 1: The Choroid Plexus
                </p>

                <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden relative z-10">
                  <div className="h-full w-1/3 bg-primary" />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-2 relative z-10">
                  <span>04:20</span>
                  <span>16:00</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground font-mono">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Total Duration:</span>
                  <span className="text-foreground">143 minutes</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Audio Quality:</span>
                  <span className="text-foreground">320kbps MP3</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="text-foreground">2/12 unlocked</span>
                </div>
              </div>
            </div>
          </HudPanel>

          {/* Practice Stats */}
          <HudPanel
            title="PRACTICE METRICS"
            icon={<Activity className="h-4 w-4" />}
            variant="default"
            className="h-full"
          >
            <div className="grid grid-cols-2 gap-4 h-full content-start">
              <DataDisplay label="Sessions" value="12" trend="up" trendValue="3 this week" />
              <DataDisplay label="Time" value="4.2" unit="h" trend="neutral" trendValue="Total practice" />
              <DataDisplay label="Streak" value="7" unit="d" trend="up" trendValue="Current streak" />
              <DataDisplay label="Next Session" value="19" unit="h" variant="warning" trend="neutral" trendValue="Recommended" />
            </div>
          </HudPanel>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { isLoading, isAuthenticated } = useSupabaseSession();

  return (
    <TooltipProvider>
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <motion.div
        id="main-content"
        className="relative min-h-screen overflow-hidden pt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section - Wrapped in TechFrame */}
        <section className="relative px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <TechFrame variant="tech" size="lg" className="min-h-[70vh]">
              <CornerOrnament position="top-left" />
              <CornerOrnament position="top-right" />
              <CornerOrnament position="bottom-left" />
              <CornerOrnament position="bottom-right" />

              {/* Background gradient orb */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-ember-500/5 via-ocean-500/5 to-lunar-500/5 blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center">
                {/* Light pillar accent */}
                <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                  <div className="relative">
                    <LightPillar color="solar" height={48} width={3} intensity="low" />
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-solar-400/60" />
                  </div>
                </motion.div>

                {/* Main title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-metallic"
                >
                  <span className="bg-gradient-to-r from-ember-300 via-ocean-300 to-lunar-300 bg-clip-text text-transparent">
                    Somatic Canticles
                  </span>
                </motion.h1>

                {/* Mission Brief */}
                <motion.div
                  variants={itemVariants}
                  className="mx-auto mt-6 max-w-xl rounded-lg border border-border/50 bg-background/50 p-6 text-center backdrop-blur-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Mission Brief
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg mb-2">
                    Synchronize consciousness through 12 sacred chapters.
                  </p>
                  <p className="text-sm opacity-80 text-muted-foreground/80 font-mono">
                    Unlock protocol tied to 4-cycle biorhythm tracking system.
                  </p>
                </motion.div>

                {/* Auth-Aware CTA Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                >
                  {isAuthenticated ? (
                    <Link href="/chapters">
                      <Button
                        size="lg"
                        aria-label="Enter the Canticles chapters"
                        className="group h-11 gap-2 px-6 text-sm font-medium"
                      >
                        <BookOpen className="h-4 w-4" />
                        Enter the Canticles
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <AuthModal
                            trigger={
                              <Button
                                size="lg"
                                aria-label="Enter the Canticles chapters"
                                className="group h-11 gap-2 px-6 text-sm font-medium"
                              >
                                <BookOpen className="h-4 w-4" />
                                Enter the Canticles
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                              </Button>
                            }
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign in to access chapters</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      aria-label="Access Biorhythm Dashboard"
                      className="h-11 gap-2 px-6 text-sm font-medium"
                    >
                      <Activity className="h-4 w-4" />
                      Access Biorhythm Dashboard
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                variants={itemVariants}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <ChevronDown className="h-5 w-5 animate-bounce text-muted-foreground/50" />
              </motion.div>
            </TechFrame>
          </div>
        </section>

        {/* What Are Biorhythms Section */}
        <BiorhythmsExplainerSection />

        {/* Section Divider */}
        <SectionDivider label="The Four Cycles" className="mx-auto max-w-6xl px-4" />

        {/* The 4 Cycles Section - Using HudPanels */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div variants={itemVariants} className="mb-16 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-metallic">
                The Four Cycles
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Ancient wisdom meets modern biorhythm science
              </p>
            </motion.div>

            {/* Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {cycles.map((cycle) => {
                const Icon = cycle.icon;
                return (
                  <motion.div
                    key={cycle.name}
                    variants={itemVariants}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                    tabIndex={0}
                    role="article"
                    aria-label={`${cycle.name} cycle: ${cycle.days}-day period governing ${cycle.element.toLowerCase()} and vitality`}
                  >
                    <HudPanel
                      title={cycle.name}
                      icon={<Icon className={`h-4 w-4 ${cycle.iconColor}`} />}
                      variant={cycle.color === "ember" ? "alert" : cycle.color === "ocean" ? "default" : "tech"}
                      className={`scan-lines h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cycle.glow}`}
                    >
                      <div className="space-y-4">
                        {/* Element type */}
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                          {cycle.element}
                        </p>

                        {/* Data Display for cycle period */}
                        <DataDisplay
                          label="Period"
                          value={cycle.days}
                          unit="days"
                          variant={cycle.color === "ember" ? "warning" : cycle.color === "ocean" ? "default" : cycle.color === "solar" ? "success" : "tech"}
                        />

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {cycle.description}
                        </p>
                      </div>
                    </HudPanel>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Chapter Progression Section */}
        <ChapterProgressionSection />

        {/* Consciousness Sync Station Section */}
        <ConsciousnessSyncSection />

        {/* Section Divider */}
        <SectionDivider label="System Capabilities" className="mx-auto max-w-6xl px-4" />

        {/* Features Section - Wrapped in TechFrame */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <TechFrame variant="default" className="py-12">
              <CornerOrnament position="top-left" />
              <CornerOrnament position="top-right" />
              <CornerOrnament position="bottom-left" />
              <CornerOrnament position="bottom-right" />

              <motion.div
                variants={containerVariants}
                className="grid gap-8 sm:grid-cols-3"
              >
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      variants={itemVariants}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-metallic">{feature.title}</h3>
                      <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </TechFrame>
          </div>
        </section>

        {/* Section Divider */}
        <SectionDivider label="Begin Your Journey" className="mx-auto max-w-6xl px-4" />

        {/* CTA Section with System Requirements - Wrapped in TechFrame */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <TechFrame variant="gold" size="lg" className="glass">
              <CornerOrnament position="top-left" />
              <CornerOrnament position="top-right" />
              <CornerOrnament position="bottom-left" />
              <CornerOrnament position="bottom-right" />

              {/* Subtle background decoration */}
              <div className="pointer-events-none absolute inset-0 opacity-50 overflow-hidden rounded-lg">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
              </div>

              <div className="relative text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl text-metallic">
                  Begin Your Journey
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  The 12 Somatic Canticles await. Each chapter unlocks based on your
                  unique biorhythm patterns.
                </p>

                {/* System Requirements */}
                <div className="my-8 space-y-4 text-left">
                  <SystemRequirements />
                  <ExpectedTimeline />
                </div>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      aria-label="Start your journey"
                      className="h-11 gap-2 px-6 text-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start Your Journey
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="lg"
                      aria-label="Sign in to your account"
                      className="h-11 px-6 text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </TechFrame>
          </div>
        </section>

        {/* HUD-Style Footer */}
        <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-lg border border-metal-700 bg-metal-900/60 px-4 py-3">
              <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-4">
                  <span className="font-mono">Active Practitioners: 2,847</span>
                  <span className="hidden sm:inline text-metal-600">|</span>
                  <span className="font-mono hidden sm:inline">Chapters Unlocked: 18,234</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono">v1.0.0-beta</span>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 font-mono">99.8% Uptime</span>
                  </span>
                </div>
              </div>
            </div>
            <SectionDivider label="Somatic Canticles" className="my-6" />
            <p className="text-center text-xs text-muted-foreground/60">
              © 2026 Somatic Canticles · MIT License · Powered by Supabase · Cloudflare DNS
            </p>
          </div>
        </footer>
      </motion.div>
    </TooltipProvider>
  );
}
