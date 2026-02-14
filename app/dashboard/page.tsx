"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Activity, RefreshCw, Calendar, TrendingUp, Sparkles, User, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TechFrame, HudPanel, DataDisplay } from "@/components/ui/frame";
import { LightPillarGroup } from "@/components/effects/LightPillar";

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
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const [user, setUser] = useState<{ email?: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>(browserTimezone);
  const [biorhythmData, setBiorhythmData] = useState<BiorhythmData | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Not authenticated, will be handled by middleware
        return;
      }

      setUser(user);

      // Fetch user role from public.users table
      const { data: userData } = await supabase
        .from('users')
        .select('role, birthdate, timezone')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUserRole(userData.role);
        const metadataTimezone =
          typeof user.user_metadata?.timezone === "string"
            ? user.user_metadata.timezone
            : undefined;
        setTimezone(userData.timezone || metadataTimezone || browserTimezone);
        if (userData.birthdate) {
          setBirthdate(userData.birthdate);
        } else {
          // Check if user has birthdate in metadata
          const userBirthdate = user.user_metadata?.birthdate;
          if (userBirthdate) {
            setBirthdate(userBirthdate);
          } else {
            // Show onboarding modal if no birthdate
            setShowOnboarding(true);
            setLoading(false);
          }
        }
      } else {
        // Fallback to user metadata
        const userBirthdate = user.user_metadata?.birthdate;
        const metadataTimezone =
          typeof user.user_metadata?.timezone === "string"
            ? user.user_metadata.timezone
            : undefined;
        setTimezone(metadataTimezone || browserTimezone);
        if (userBirthdate) {
          setBirthdate(userBirthdate);
        } else {
          setShowOnboarding(true);
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [supabase, browserTimezone]);

  // Fetch biorhythm data when birthdate is available
  const fetchData = useCallback(async (showToast = false) => {
    if (!birthdate) return;

    try {
      setRefreshing(true);

      const today = format(new Date(), "yyyy-MM-dd");

      // Fetch current biorhythm and 30-day prediction in parallel
      const [biorhythm, prediction] = await Promise.all([
        calculateBiorhythm(birthdate, today, timezone),
        getBiorhythmPrediction(today, 30, { birthdate, timezone }),
      ]);

      setBiorhythmData(biorhythm);
      setPredictionData(prediction);
      setDataError(null);

      if (showToast) {
        toast.success("Biorhythm data refreshed");
      }
    } catch (error) {
      console.error("Biorhythm fetch error:", error);
      setDataError(getBiorhythmErrorMessage(error));
      if (showToast) {
        toast.error(getBiorhythmErrorMessage(error));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [birthdate, timezone]);

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
  const userDisplayName =
    user?.email?.split("@")[0] ||
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "there");

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
          <TechFrame variant="gold" size="lg" className="relative overflow-hidden">
            {/* Light Pillar Group Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <LightPillarGroup
                count={5}
                spacing={60}
                colors={["solar", "transform", "architect", "world", "unity"]}
                intensity="low"
                height="100%"
                className="absolute right-8 top-0 h-full"
              />
            </div>
            
            <div className="relative flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Welcome back, {userDisplayName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ready to continue your journey?
                  </p>
                </div>
                {/* Admin Badge */}
                {userRole === 'admin' && (
                  <div className="ml-2">
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 border border-amber-500/30">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Admin</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link href="/chapters">
                  <Button size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Continue Journey
                  </Button>
                </Link>
              </div>
            </div>
          </TechFrame>
        </motion.div>
      )}

      {dataError && (
        <motion.div variants={itemVariants}>
          <TechFrame variant="alert">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-400">Data Sync Issue</p>
                <p className="text-sm text-muted-foreground">{dataError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(true)}
                disabled={refreshing}
              >
                Retry
              </Button>
            </div>
          </TechFrame>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-metallic">Today&apos;s Biorhythm</h1>
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

      {/* Summary Cards - DataDisplay */}
      {summary && (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={itemVariants}
        >
          {/* Peak Cycles */}
          <DataDisplay
            label="Peak Cycles"
            value={summary.peaks.length}
            icon={<Sparkles className="h-4 w-4" />}
            variant="success"
            trendValue={summary.peaks.length > 0 ? summary.peaks.map((p) => p.key).join(", ") : "No peaks today"}
          />

          {/* Critical Days */}
          <DataDisplay
            label="Critical Days"
            value={summary.criticals.length}
            icon={<Activity className="h-4 w-4" />}
            variant="warning"
            trendValue={summary.criticals.length > 0 ? "Take it easy today" : "No critical cycles"}
          />

          {/* Strongest Cycle */}
          {(() => {
            const best = summary.cycles.reduce((max, c) =>
              c.value > max.value ? c : max
            );
            return (
              <DataDisplay
                label="Strongest"
                value={best.key.charAt(0).toUpperCase() + best.key.slice(1)}
                icon={<TrendingUp className="h-4 w-4" />}
                variant="tech"
                trendValue={`${Math.round(best.value * 100)}% positive`}
              />
            );
          })()}

          {/* Next Peak */}
          {predictionData && (
            (() => {
              // Find next peak date
              const allPeaks = [
                ...(predictionData.peaks?.physical ?? []).map((d: string) => ({ date: d, cycle: "physical" })),
                ...(predictionData.peaks?.emotional ?? []).map((d: string) => ({ date: d, cycle: "emotional" })),
                ...(predictionData.peaks?.intellectual ?? []).map((d: string) => ({ date: d, cycle: "intellectual" })),
                ...(predictionData.peaks?.spiritual ?? []).map((d: string) => ({ date: d, cycle: "spiritual" })),
              ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              const nextPeak = allPeaks[0];

              return (
                <DataDisplay
                  label="Next Peak"
                  value={nextPeak ? format(new Date(nextPeak.date), "MMM d") : "—"}
                  icon={<Calendar className="h-4 w-4" />}
                  variant="default"
                  trendValue={nextPeak ? `${nextPeak.cycle} cycle` : "No peaks forecasted"}
                />
              );
            })()
          )}
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Biorhythm Wheel */}
        <motion.div variants={itemVariants}>
          <HudPanel
            title="Cycle Wheel"
            icon={<Activity className="h-5 w-5 text-primary" />}
            className="scan-lines h-full"
          >
            <div className="flex items-center justify-center py-4">
              {biorhythmData ? (
                <BiorhythmWheel
                  data={biorhythmData}
                  size={260}
                  animated={!refreshing}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No cycle data available.</p>
              )}
            </div>
          </HudPanel>
        </motion.div>

        {/* Cycle Bars */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <HudPanel
            title="Current Levels"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            className="scan-lines h-full"
          >
            {biorhythmData ? (
              <CycleBars data={biorhythmData} animated={!refreshing} />
            ) : (
              <p className="text-sm text-muted-foreground">Current levels unavailable.</p>
            )}
          </HudPanel>
        </motion.div>
      </div>

      {/* 7-Day Forecast (Mini) */}
      <motion.div variants={itemVariants}>
        <HudPanel
          title="7-Day Preview"
          icon={<Calendar className="h-5 w-5 text-primary" />}
          className="scan-lines"
        >
          {predictionData ? (
            <ForecastChart
              data={predictionData}
              days={7}
              compact
              height={180}
              animated={!refreshing}
            />
          ) : (
            <p className="text-sm text-muted-foreground">7-day forecast unavailable.</p>
          )}
        </HudPanel>
      </motion.div>

      {/* Full 30-Day Forecast */}
      <motion.div variants={itemVariants}>
        <HudPanel
          title="30-Day Forecast"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          className="scan-lines"
        >
          {predictionData ? (
            <ForecastChart
              data={predictionData}
              days={30}
              height={350}
              animated={!refreshing}
            />
          ) : (
            <p className="text-sm text-muted-foreground">30-day forecast unavailable.</p>
          )}
        </HudPanel>
      </motion.div>

      {/* Info Section */}
      <motion.div variants={itemVariants}>
        <TechFrame variant="default" className="relative">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <LightPillarGroup
                count={3}
                spacing={12}
                colors={["solar", "transform", "architect"]}
                intensity="low"
                height={40}
              />
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
        </TechFrame>
      </motion.div>
    </motion.div>
  );
}
