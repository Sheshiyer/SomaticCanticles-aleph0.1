"use client";

import { motion } from "framer-motion";
import { Cloud, Database, ExternalLink, GitBranch, Settings } from "lucide-react";
import { HudPanel, TechFrame } from "@/components/ui/frame";

function getSupabaseDashboardUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return "https://supabase.com/dashboard";
  }

  const match = supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/i);
  if (!match?.[1]) {
    return "https://supabase.com/dashboard";
  }

  return `https://supabase.com/dashboard/project/${match[1]}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function AdminSettingsPage() {
  return (
    <TechFrame variant="default" className="scan-lines min-h-[calc(100vh-8rem)]">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Settings className="h-7 w-7 text-metallic" />
          <div>
            <h1 className="text-3xl font-bold text-metallic">Platform Settings</h1>
            <p className="text-sm text-muted-foreground">
              Current infrastructure map after the Supabase migration
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HudPanel title="Infrastructure Status" icon={<Database className="h-4 w-4" />} variant="tech">
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href={getSupabaseDashboardUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/10"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-semibold text-metallic">Supabase</h3>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 text-cyan-400/80" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Primary backend for Auth, Postgres, Storage, and functions.
                </p>
              </a>

              <a
                href="https://dash.cloudflare.com/?to=/:account/domains"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 transition-all hover:border-amber-400/60 hover:bg-amber-500/10"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-amber-400" />
                  <h3 className="font-semibold text-metallic">Cloudflare DNS</h3>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 text-amber-400/80" />
                </div>
                <p className="text-sm text-muted-foreground">
                  DNS and domain routing only. Workers, D1, and R2 are retired.
                </p>
              </a>

              <a
                href="https://github.com/Sheshiyer/SomaticCanticles-aleph0.1"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-metal-700 bg-metal-900/40 p-4 transition-all hover:border-metal-500 hover:bg-metal-800/50"
              >
                <div className="mb-2 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-metal-300" />
                  <h3 className="font-semibold text-metallic">GitHub</h3>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 text-metal-300/80" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Source repository and deployment workflow.
                </p>
              </a>
            </div>
          </HudPanel>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HudPanel title="Migration Notes" icon={<Cloud className="h-4 w-4" />} variant="alert">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Data + auth stack is now managed in Supabase.</li>
              <li>Cloudflare is retained for DNS/domain management only.</li>
              <li>Operational runbooks should reference Supabase dashboards first.</li>
            </ul>
          </HudPanel>
        </motion.div>
      </motion.div>
    </TechFrame>
  );
}
