"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, ChevronRight, Cpu, Activity, Zap, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCodonResult } from "@/lib/narrative/codons";

interface TerminalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onCommand?: (command: string, args: string[]) => void;
}

const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ isOpen, onClose, onCommand }) => {
    const [input, setInput] = useState("");
    const [theme, setTheme] = useState<"cyan" | "amber" | "green">("cyan");
    const [history, setHistory] = useState<{ type: "input" | "output" | "error" | "system"; text: string }[]>([
        { type: "system", text: "SOMATIC CANTICLES - ANAMNESIS ENGINE [v3.1.2]" },
        { type: "system", text: "ESTABLISHING CRYSTALLIZATION INTERFACE PROTOCOLS..." },
        { type: "output", text: "SESSION SECURED. KHALOREE FIELD DETECTED." },
        { type: "output", text: "TYPE 'HELP' FOR SYSTEM COMMANDS." }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        setHistory(prev => [...prev, { type: "input", text: trimmed }]);
        const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);

        processCommand(cmd, args);
        setInput("");
    };

    const processCommand = (cmd: string, args: string[]) => {
        switch (cmd) {
            case "help":
                setHistory(prev => [...prev, {
                    type: "output",
                    text: "AVAILABLE COMMANDS:\n  HELP - Display this menu\n  CODEX [XXX] - Parse 64 sacred codons (e.g., CODEX AUG)\n  COLOR [THEME] - Switch interface (CYAN, AMBER, GREEN)\n  CLEAR - Wipe terminal buffer\n  REVEAL - Query biorhythm status\n  JUMP [ID] - Force narrative jump\n  STATS - Connection metrics\n  EXIT - Terminate session"
                }]);
                break;
            case "codex":
                const sequence = args[0];
                if (!sequence) {
                    setHistory(prev => [...prev, { type: "error", text: "ERROR: NUCLEOTIDE SEQUENCE REQUIRED (E.G. CODEX AUG)" }]);
                    return;
                }
                try {
                    const result = getCodonResult(sequence);
                    setHistory(prev => [...prev, {
                        type: "output",
                        text: `SYNTHESIS RESULT: ${result.aminoAcid}\nRESONANCE: ${result.resonance}\nFREQUENCY: ${result.frequency} Hz\nSTATUS: ${result.description}`
                    }]);
                } catch (err: any) {
                    setHistory(prev => [...prev, { type: "error", text: `SYNTHESIS FAILURE: ${err.message}` }]);
                }
                break;
            case "color":
                const targetTheme = args[0] as any;
                if (["cyan", "amber", "green"].includes(targetTheme)) {
                    setTheme(targetTheme);
                    setHistory(prev => [...prev, { type: "system", text: `INTERFACE RECONFIGURED TO: ${targetTheme.toUpperCase()}` }]);
                } else {
                    setHistory(prev => [...prev, { type: "error", text: "ERROR: INVALID THEME. USE CYAN, AMBER, OR GREEN." }]);
                }
                break;
            case "clear":
                setHistory([]);
                break;
            case "exit":
                onClose();
                break;
            case "reveal":
                setHistory(prev => [...prev, { type: "output", text: "QUERYING BIORHYTHM CLOUD... [PHYSICAL: 0.82 | EMOTIONAL: 0.45 | INTELLECTUAL: 0.91]" }]);
                break;
            case "jump":
                if (args[0]) {
                    setHistory(prev => [...prev, { type: "output", text: `INITIATING JUMP TO SECTOR: ${args[0]}...` }]);
                    onCommand?.("jump", args);
                } else {
                    setHistory(prev => [...prev, { type: "error", text: "ERROR: TARGET SECTOR REQUIRED" }]);
                }
                break;
            case "stats":
                setHistory(prev => [...prev, { type: "output", text: "LATENCY: 24ms\nBANDWIDTH: 1.2 GB/S\nREJECTION: 0.002%\nINTERFACE: KHALOREE-V12" }]);
                break;
            default:
                setHistory(prev => [...prev, { type: "error", text: `COMMAND NOT RECOGNIZED: ${cmd}` }]);
                break;
        }
    };

    const themeColors = {
        cyan: "text-primary border-primary shadow-[0_0_20px_rgba(0,255,255,0.2)]",
        amber: "text-amber-500 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
        green: "text-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
    };

    const themePrimary = {
        cyan: "rgba(0, 255, 255, 1)",
        amber: "rgba(245, 158, 11, 1)",
        green: "rgba(16, 185, 129, 1)"
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8 overflow-hidden"
                >
                    {/* CRT Screen Frame */}
                    <div className={cn(
                        "w-full max-w-5xl aspect-[16/10] bg-[#050505] border-4 rounded-[40px] relative overflow-hidden flex flex-col font-mono transition-all duration-500",
                        theme === "cyan" && "border-primary/20 shadow-[0_0_100px_rgba(0,255,255,0.1)]",
                        theme === "amber" && "border-amber-900/40 shadow-[0_0_100px_rgba(245,158,11,0.1)]",
                        theme === "green" && "border-emerald-900/40 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                    )}>
                        {/* CRT Glass Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(18,16,16,0)_0%,rgba(0,0,0,0.4)_100%)]" />

                        {/* Scanlines & Flicker */}
                        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[2] bg-[length:100%_4px,3px_100%]" />
                            <div className="absolute inset-x-0 h-2 bg-white/5 animate-scanline pointer-events-none" />
                            <div className="absolute inset-0 animate-flicker opacity-[0.03] bg-white pointer-events-none" />
                        </div>

                        {/* Decoration: Inner Frame */}
                        <div className="absolute inset-4 border border-white/5 rounded-[30px] pointer-events-none z-0" />

                        {/* Header Bar */}
                        <div className={cn(
                            "px-8 py-4 flex items-center justify-between z-30",
                            theme === "cyan" && "bg-primary/5 border-b border-primary/20",
                            theme === "amber" && "bg-amber-500/5 border-b border-amber-500/20",
                            theme === "green" && "bg-emerald-500/5 border-b border-emerald-500/20"
                        )}>
                            <div className="flex items-center gap-3">
                                <TerminalIcon className={cn("w-5 h-5", theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500")} />
                                <div className="flex flex-col">
                                    <span className={cn("text-[10px] tracking-[0.3em] font-black uppercase opacity-60", theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500")}>
                                        System Node // ANAMNESIS-V12
                                    </span>
                                    <span className={cn("text-[9px] opacity-40 uppercase", theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500")}>
                                        Sector: 12-B // Status: ENCRYPTED
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                                <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity">
                                    <X className={cn("w-5 h-5", theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500")} />
                                </button>
                            </div>
                        </div>

                        {/* Output Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-12 space-y-3 z-30 selection:bg-white/10 scrollbar-hide"
                        >
                            {history.map((line, i) => (
                                <div key={i} className={cn(
                                    "text-sm tracking-wide leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300",
                                    line.type === "input" && "opacity-60 flex items-start gap-3",
                                    line.type === "output" && (theme === "cyan" ? "text-primary/95" : theme === "amber" ? "text-amber-500/95" : "text-emerald-500/95"),
                                    line.type === "error" && "text-rose-500 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]",
                                    line.type === "system" && "opacity-40 italic text-[11px]"
                                )}>
                                    {line.type === "input" && <span className={theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500"}>&gt;</span>}
                                    <span className="whitespace-pre-wrap">{line.text}</span>
                                </div>
                            ))}
                            <form onSubmit={handleCommand} className="flex items-center gap-3 animate-in fade-in duration-500 delay-300">
                                <span className={cn("animate-pulse font-black", theme === "cyan" ? "text-primary" : theme === "amber" ? "text-amber-500" : "text-emerald-500")}>&gt;</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={cn(
                                        "flex-1 bg-transparent border-none outline-none text-sm tracking-widest uppercase",
                                        theme === "cyan" ? "text-primary placeholder:text-primary/20" : theme === "amber" ? "text-amber-400 placeholder:text-amber-500/20" : "text-emerald-400 placeholder:text-emerald-500/20"
                                    )}
                                    placeholder="_"
                                    autoFocus
                                />
                            </form>
                        </div>

                        {/* Status Footer */}
                        <div className={cn(
                            "px-8 py-4 flex items-center justify-between z-30 text-[9px] tracking-widest font-bold",
                            theme === "cyan" ? "text-primary/40 bg-primary/5" : theme === "amber" ? "text-amber-500/40 bg-amber-500/5" : "text-emerald-500/40 bg-emerald-500/5"
                        )}>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 animate-pulse" />
                                    <span>CONNECTION: SECURE [99.9%]</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-3 h-3" />
                                    <span>GPY_CORE: ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-3 h-3" />
                                    <span>RES: 1024x768</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="animate-pulse">ONLINE</span>
                                <div className={cn("w-2 h-2 rounded-full", theme === "cyan" ? "bg-primary shadow-[0_0_8px_rgba(0,255,255,1)]" : theme === "amber" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]")} />
                            </div>
                        </div>
                    </div>

                    <style jsx global>{`
                        @keyframes scanline {
                            0% { transform: translateY(-100%); }
                            100% { transform: translateY(1000%); }
                        }
                        @keyframes flicker {
                            0% { opacity: 0.27861; }
                            5% { opacity: 0.34769; }
                            10% { opacity: 0.23604; }
                            15% { opacity: 0.90626; }
                            20% { opacity: 0.18128; }
                            25% { opacity: 0.83891; }
                            30% { opacity: 0.65583; }
                            35% { opacity: 0.57807; }
                            40% { opacity: 0.26559; }
                            45% { opacity: 0.84693; }
                            50% { opacity: 0.96019; }
                            55% { opacity: 0.08523; }
                            60% { opacity: 0.71313; }
                            65% { opacity: 0.33441; }
                            70% { opacity: 0.77427; }
                            75% { opacity: 0.14245; }
                            80% { opacity: 0.45197; }
                            85% { opacity: 0.65991; }
                            90% { opacity: 0.033ae; }
                            95% { opacity: 0.85197; }
                            100% { opacity: 0.27363; }
                        }
                        .animate-scanline {
                            animation: scanline 8s linear infinite;
                        }
                        .animate-flicker {
                            animation: flicker 0.15s infinite;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TerminalOverlay;
