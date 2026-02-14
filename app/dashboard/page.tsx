"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Activity, RefreshCw, Calendar, TrendingUp, Sparkles, User, BookOpen } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LightPillar } from "@/components/effects/LightPillar";

import { BiorhythmWheel } from "@/components/biorhythm/BiorhythmWheel";
import { CycleBars } from "@/components/biorhythm/CycleBars";
import { ForecastChart } from "@/components/biorhythm/ForecastChart";

import {
  calculateBiorhythm,
  getBiorhythmPrediction,
  getBiorhythmErrorMessage,
  type BiorhythmData,
  type PredictionData,
  isPeak,
  getCycleStatus,
} from "@/lib/biorhythm";
import { createClient } from "@/lib/supabase/client";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

// Animation variants
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

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [biorhythmData, setBiorhythmData] = useState<BiorhythmData | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [birthdate, setBirthdate] = useState<string | null>(null);

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Not authenticated, will be handled by middleware
        return;
      }

      setUser(user);

      // Check if user has birthdate in metadata
      const userBirthdate = user.user_metadata?.birthdate;

      if (userBirthdate) {
        setBirthdate(userBirthdate);
      } else {
        // Show onboarding modal if no birthdate
        setShowOnboarding(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  // Fetch biorhythm data when birthdate is available
  const fetchData = useCallback(async (showToast = false) => {
    if (!birthdate) return;

    try {
      setRefreshing(true);

      const today = format(new Date(), "yyyy-MM-dd");

      // Fetch current biorhythm and 30-day prediction in parallel
      const [biorhythm, prediction] = await Promise.all([
        calculateBiorhythm(birthdate, today),
        getBiorhythmPrediction(today, 30),
      ]);

      setBiorhythmData(biorhythm);
      setPredictionData(prediction);

      if (showToast) {
        toast.success("Biorhythm data refreshed");
      }
    } catch (error) {
      console.error("Biorhythm fetch error:", error);
      // Silently fail - onboarding modal will show if needed
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [birthdate]);

  // Initial fetch when birthdate is available
  useEffect(() => {
    if (birthdate) {
      fetchData();
    }
  }, [birthdate, fetchData]);

  // Auto-refresh at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set timeout for midnight refresh
    const midnightTimeout = setTimeout(() => {
      fetchData(true);
      // Then set up daily interval
      const dailyInterval = setInterval(() => {
        fetchData(true);
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, [fetchData]);

  // Get today's summary
  const getTodaySummary = () => {
    if (!biorhythmData) return null;

    const cycles = [
      { key: "physical", value: biorhythmData.physical.value },
      { key: "emotional", value: biorhythmData.emotional.value },
      { key: "intellectual", value: biorhythmData.intellectual.value },
      { key: "spiritual", value: biorhythmData.spiritual.value },
    ];

    const peaks = cycles.filter((c) => isPeak(c.value));
    const criticals = cycles.filter((c) => getCycleStatus(c.value) === "critical");

    return { peaks, criticals, cycles };
  };

  const summary = getTodaySummary();

  const handleOnboardingComplete = (newBirthdate: string) => {
    setBirthdate(newBirthdate);
    setShowOnboarding(false);
  };

  // Show onboarding modal if needed
  if (showOnboarding) {
    return (
      <OnboardingModal
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground">Loading your biorhythm...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      {user && (
        <motion.div variants={itemVariants}>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Welcome back, {user?.email?.split("@")[0] || user?.user_metadata?.full_name || 'there'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ready to continue your journey?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/chapters">
                  <Button size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Continue Journey
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Biorhythm</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={itemVariants}
        >
          {/* Peak Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Peak Cycles</CardTitle>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.peaks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.peaks.length > 0
                  ? summary.peaks.map((p) => p.key).join(", ")
                  : "No peaks today"}
              </p>
            </CardContent>
          </Card>

          {/* Critical Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Days</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.criticals.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.criticals.length > 0
                  ? "Take it easy today"
                  : "No critical cycles"}
              </p>
            </CardContent>
          </Card>

          {/* Best Cycle Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Strongest</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {(() => {
                const best = summary.cycles.reduce((max, c) =>
                  c.value > max.value ? c : max
                );
                return (
                  <>
                    <div className="text-2xl font-bold capitalize">
                      {best.key}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(best.value * 100)}% positive
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* Forecast Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Peak</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {predictionData && (
                (() => {
                  // Find next peak date
                  const allPeaks = [
                    ...predictionData.peaks.physical.map((d: string) => ({ date: d, cycle: "physical" })),
                    ...predictionData.peaks.emotional.map((d: string) => ({ date: d, cycle: "emotional" })),
                    ...predictionData.peaks.intellectual.map((d: string) => ({ date: d, cycle: "intellectual" })),
                    ...predictionData.peaks.spiritual.map((d: string) => ({ date: d, cycle: "spiritual" })),
                  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                  const nextPeak = allPeaks[0];

                  return (
                    <>
                      <div className="text-2xl font-bold">
                        {nextPeak
                          ? format(new Date(nextPeak.date), "MMM d")
                          : "—"}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {nextPeak ? `${nextPeak.cycle} cycle` : "No peaks forecasted"}
                      </p>
                    </>
                  );
                })()
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Biorhythm Wheel */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Cycle Wheel
              </CardTitle>
              <CardDescription>
                Visual representation of your current biorhythm cycles
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-8">
              {biorhythmData && (
                <BiorhythmWheel
                  data={biorhythmData}
                  size={260}
                  animated={!refreshing}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cycle Bars */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Current Levels
              </CardTitle>
              <CardDescription>
                Detailed breakdown of each cycle&apos;s current value
              </CardDescription>
            </CardHeader>
            <CardContent>
              {biorhythmData && (
                <CycleBars data={biorhythmData} animated={!refreshing} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 7-Day Forecast (Mini) */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              7-Day Preview
            </CardTitle>
            <CardDescription>
              Upcoming trends for the next week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {predictionData && (
              <ForecastChart
                data={predictionData}
                days={7}
                compact
                height={180}
                animated={!refreshing}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Full 30-Day Forecast */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              30-Day Forecast
            </CardTitle>
            <CardDescription>
              Complete biorhythm forecast with peak and critical day indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {predictionData && (
              <ForecastChart
                data={predictionData}
                days={30}
                height={350}
                animated={!refreshing}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg border bg-muted/50 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <LightPillar color="solar" height={40} width={3} intensity="low" />
          </div>
          <div>
            <h3 className="font-semibold">About Biorhythms</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Biorhythms are biological cycles that influence your physical, emotional,
              intellectual, and spiritual well-being. Each cycle has a different length:
              Physical (23 days), Emotional (28 days), Intellectual (33 days), and
              Spiritual (38 days). High points indicate optimal performance, while
              critical days (near zero) suggest caution.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
