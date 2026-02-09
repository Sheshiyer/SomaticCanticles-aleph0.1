"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Activity, Sparkles, ArrowRight, Waves, Brain, Moon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LightPillar } from "@/components/effects/LightPillar";

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
    description: "38-day cycle governing intuition, awareness, and inner peace",
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

export default function HomePage() {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background gradient orb */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-br from-ember-500/5 via-ocean-500/5 to-lunar-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Light pillar accent */}
          <motion.div 
            variants={itemVariants} 
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <LightPillar color="solar" height={48} width={3} intensity="low" />
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-solar-400/60" />
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-ember-300 via-ocean-300 to-lunar-300 bg-clip-text text-transparent">
              Somatic Canticles
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A sacred journey through 12 canticles, unlocked by the rhythms of your being.
            Track your cycles. Discover your wisdom.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link href="/chapters">
              <Button 
                size="lg" 
                className="group h-11 gap-2 px-6 text-sm font-medium"
              >
                <BookOpen className="h-4 w-4" />
                Enter the Canticles
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="lg"
                className="h-11 gap-2 px-6 text-sm font-medium"
              >
                <Activity className="h-4 w-4" />
                View Your Cycles
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
      </section>

      {/* The 4 Cycles Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The Four Cycles
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Ancient wisdom meets modern biorhythm science
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {cycles.map((cycle) => {
              const Icon = cycle.icon;
              return (
                <motion.div key={cycle.name} variants={itemVariants}>
                  <Card
                    className={`group relative h-full overflow-hidden border ${cycle.border} ${cycle.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cycle.glow}`}
                  >
                    <CardHeader className="space-y-3 pb-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${cycle.border} ${cycle.bg}`}
                      >
                        <Icon className={`h-5 w-5 ${cycle.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-base font-semibold ${cycle.text}`}>
                          {cycle.name}
                        </CardTitle>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                          {cycle.element}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {cycle.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
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
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-muted/30 to-muted/10 p-8 text-center sm:p-12"
          >
            {/* Subtle background decoration */}
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
            </div>

            <div className="relative">
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Begin Your Journey
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                The 12 Somatic Canticles await. Each chapter unlocks based on your
                unique biorhythm patterns.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="h-11 gap-2 px-6 text-sm">
                    <Sparkles className="h-4 w-4" />
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="h-11 px-6 text-sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs text-muted-foreground/60">
            © 2026 Somatic Canticles
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
