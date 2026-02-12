"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChapterCelebrationProps {
    isOpen: boolean;
    chapterTitle: string;
    onContinue: () => void;
}

const ChapterCelebration: React.FC<ChapterCelebrationProps> = ({
    isOpen,
    chapterTitle,
    onContinue,
}) => {
    useEffect(() => {
        if (isOpen) {
            // Optional: Sound effect could be triggered here
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden"
                >
                    {/* Background Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * 100 + "%",
                                    y: "110%",
                                    opacity: 0,
                                    scale: Math.random() * 0.5 + 0.5
                                }}
                                animate={{
                                    y: "-10%",
                                    opacity: [0, 1, 1, 0],
                                    rotate: 360
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 5,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "linear"
                                }}
                                className="absolute w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="relative px-8 py-12 text-center max-w-md w-full"
                    >
                        {/* Hexagonal Glow Backdrop */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="mb-8 flex justify-center">
                            <motion.div
                                initial={{ rotate: -20, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <div className="relative w-20 h-20 rounded-2xl bg-metal-900 border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                                    <Trophy className="w-10 h-10 text-primary" />
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles className="w-6 h-6 text-gold-400" />
                                </motion.div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-2">Narrative Synchronized</h2>
                            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-metal-400 bg-clip-text text-transparent mb-4 leading-tight">
                                {chapterTitle}
                            </h1>
                            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-10 px-4">
                                You have successfully completed this cycle. The transmission has been recorded and integrated into your somatic field.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                onClick={onContinue}
                                className="group relative h-12 px-8 overflow-hidden rounded-xl bg-primary text-black font-bold border-0 hover:bg-white transition-all shadow-2xl hover:shadow-primary/40"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Return to Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChapterCelebration;
