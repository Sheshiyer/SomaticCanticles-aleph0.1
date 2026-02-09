"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Activity, Sparkles, ArrowRight, Waves, Brain, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LightPillar } from "@/components/effects/LightPillar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// The 4 cycles with their Warcraft-inspired styling
const cycles = [
  {
    name: "Physical",
    element: "Body",
    icon: Activity,
    color: "ember",
    bg: "bg-ember-500/10",
    border: "border-ember-500/30",
    text: "text-ember-400",
    iconColor: "text-ember-500",
    glow: "shadow-ember-500/20",
    description: "23-day cycle governing strength, energy, and physical well-being",
  },
  {
    name: "Emotional",
    element: "Heart",
    icon: Waves,
    color: "ocean",
    bg: "bg-ocean-500/10",
    border: "border-ocean-500/30",
    text: "text-ocean-400",
    iconColor: "text-ocean-500",
    glow: "shadow-ocean-500/20",
    description: "28-day cycle governing mood, creativity, and emotional sensitivity",
  },
  {
    name: "Intellectual",
    element: "Mind",
    icon: Brain,
    color: "solar",
    bg: "bg-solar-500/10",
    border: "border-solar-500/30",
    text: "text-solar-400",
    iconColor: "text-solar-500",
    glow: "shadow-solar-500/20",
    description: "33-day cycle governing logic, memory, and mental alertness",
  },
  {
    name: "Spiritual",
    element: "Spirit",
    icon: Moon,
    color: "lunar",
    bg: "bg-lunar-500/10",
    border: "border-lunar-500/30",
    text: "text-lunar-400",
    iconColor: "text-lunar-500",
    glow: "shadow-lunar-500/20",
    description: "38-day cycle governing intuition, awareness, and inner peace",
  },
];

const features = [
  {
    title: "12 Sacred Chapters",
    description: "Unlock wisdom tied to your biorhythm cycles through 12 somatic canticles",
    icon: BookOpen,
  },
  {
    title: "Cycle Tracking",
    description: "Monitor your physical, emotional, intellectual, and spiritual cycles",
    icon: Activity,
  },
  {
    title: "Personalized Journey",
    description: "Content unlocks based on your unique biorhythm patterns",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        {/* Background Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-ember-500/20 via-ocean-500/20 to-lunar-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <div className="relative">
              <LightPillar color="solar" height={60} width={4} intensity="medium" />
              <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-solar-400 shadow-lg shadow-solar-500/50" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="bg-gradient-to-r from-ember-300 via-ocean-300 to-lunar-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
          >
            Somatic Canticles
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            A sacred journey through 12 canticles, unlocked by the rhythms of your being.
            Track your cycles. Discover your wisdom.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/chapters">
              <Button size="lg" className="group gap-2">
                <BookOpen className="h-5 w-5" />
                Enter the Canticles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="gap-2">
                <Activity className="h-5 w-5" />
                View Your Cycles
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The 4 Cycles Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The Four Cycles
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ancient wisdom meets modern biorhythm science
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {cycles.map((cycle) => {
              const Icon = cycle.icon;
              return (
                <motion.div key={cycle.name} variants={itemVariants}>
                  <Card
                    className={`group relative overflow-hidden border ${cycle.border} ${cycle.bg} transition-all duration-300 hover:shadow-lg ${cycle.glow}`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${cycle.color}-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                    />
                    <CardHeader className="relative">
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl border ${cycle.border} ${cycle.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${cycle.iconColor}`} />
                      </div>
                      <CardTitle className={`text-lg ${cycle.text}`}>
                        {cycle.name}
                      </CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wider">
                        {cycle.element}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <p className="text-sm text-muted-foreground">
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
      <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
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
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-b from-muted/50 to-muted p-8 text-center sm:p-12"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Begin Your Journey
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            The 12 Somatic Canticles await. Each chapter unlocks based on your
            unique biorhythm patterns, guiding you through an immersive
            experience of self-discovery.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2026 Somatic Canticles. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}
