"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, Zap, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NarrativeHookProps {
    type: "terminal" | "secret" | "override";
    trigger: string;
    content: string;
    className?: string;
}

export function NarrativeHook({ type, trigger, content, className }: NarrativeHookProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "transition-all duration-300 font-mono text-xs px-2 py-0.5 rounded cursor-pointer border",
                    type === "terminal" && "bg-metal-900 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary",
                    type === "secret" && "bg-transparent border-transparent text-foreground/20 hover:text-primary hover:border-primary/20",
                    type === "override" && "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500",
                    className
                )}
            >
                <span className="flex items-center gap-1.5">
                    {type === "terminal" && <Terminal className="w-3 h-3" />}
                    {type === "override" && <ShieldAlert className="w-3 h-3" />}
                    {trigger}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-metal-950 border border-metal-800 rounded-xl overflow-hidden shadow-2xl"
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-2 border-b border-metal-800 bg-metal-900">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">System Override Layer</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>

                            {/* Terminal Content */}
                            <div className="p-8 font-mono text-sm space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-2 text-primary">
                                    <Zap className="w-4 h-4" />
                                    <span className="animate-pulse">DECRYPTING TRANSMISSION...</span>
                                </div>

                                <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {content}
                                </div>

                                <div className="pt-6 border-t border-metal-900 flex justify-between items-center opacity-40">
                                    <span className="text-[10px]">AUTH_MODE: ANAMNESIS_OVERRIDE</span>
                                    <span className="text-[10px]">ENCRYPTION: KHALOREE_LAYER_7</span>
                                </div>
                            </div>

                            {/* Decorative Scanline */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-10 opacity-30" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
