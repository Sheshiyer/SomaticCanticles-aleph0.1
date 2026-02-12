"use client";

import { motion } from "framer-motion";
import { Info, Sparkles, Activity, Crosshair, Brain, Settings } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { LoreDefinition } from "@/lib/chapters/lore";
import { cn } from "@/lib/utils";

interface OraclePopoverProps {
    definition: LoreDefinition;
    children: React.ReactNode;
}

const categoryIcons = {
    technology: Activity,
    spiritual: Sparkles,
    biological: Crosshair,
    protocol: Info,
    consciousness: Brain,
    technical: Settings,
    cosmic: Sparkles,
};

const categoryColors = {
    technology: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    spiritual: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    biological: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    protocol: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    consciousness: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    technical: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    cosmic: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
};

export function OraclePopover({ definition, children }: OraclePopoverProps) {
    const Icon = categoryIcons[definition.category];
    const colors = categoryColors[definition.category];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="underline decoration-primary/30 decoration-dashed underline-offset-4 hover:decoration-primary transition-all cursor-help text-inherit font-inherit p-0 bg-transparent border-none">
                    {children}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-metal-900/95 backdrop-blur-xl border-metal-800 p-0 overflow-hidden">
                <div className={cn("p-4 border-b flex items-center justify-between", colors)}>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{definition.category}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-3 h-3 opacity-50" />
                    </motion.div>
                </div>
                <div className="p-4 space-y-3">
                    <h4 className="text-lg font-bold text-metallic m-0">{definition.term}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed m-0">
                        {definition.definition}
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                        <div className="h-px flex-1 bg-metal-800" />
                        <span className="text-[10px] uppercase tracking-tighter text-muted-foreground/50 font-mono">End Transmission</span>
                        <div className="h-px flex-1 bg-metal-800" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
