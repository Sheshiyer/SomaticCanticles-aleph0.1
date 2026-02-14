"use client";

import { useEffect, useState } from "react";
import { getRelatedLore } from "@/lib/chapters/api";
import { Book, Lock, Unlock } from "lucide-react";
import Link from "next/link"; // Assuming we'll link to a lore detail page later

interface RelatedLoreProps {
    cycle: string | null;
    className?: string;
}

interface LoreItem {
    title: string;
    type: string; // 'article' | 'glossary' | 'practice'
    category: string;
    cycle: string | null;
    achievement_id: string | null;
    unlock_level: number;
}

export function RelatedLore({ cycle, className = "" }: RelatedLoreProps) {
    const [lore, setLore] = useState<LoreItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!cycle) {
            setLoading(false);
            return;
        }

        async function fetchLore() {
            try {
                const { data } = await getRelatedLore(cycle || null);
                setLore(data || []);
            } catch (err) {
                console.error("Error loading related lore:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchLore();
    }, [cycle]);

    if (!cycle || (lore.length === 0 && !loading)) {
        return null;
    }

    return (
        <div className={`mt-8 border-t border-white/10 pt-6 ${className}`}>
            <h3 className="text-lg font-serif mb-4 flex items-center gap-2 text-primary-300">
                <Book className="w-5 h-5" />
                Grimoire Entries: {cycle ? cycle.charAt(0).toUpperCase() + cycle.slice(1) : ""}
            </h3>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-12 bg-white/5 rounded-md w-full"></div>
                    <div className="h-12 bg-white/5 rounded-md w-full"></div>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {lore.map((item, idx) => (
                        <div
                            key={idx}
                            className="group relative p-4 rounded-lg bg-black/40 border border-white/5 hover:border-primary-500/30 transition-all hover:bg-white/5 cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                                        {item.category} • {item.type}
                                    </div>
                                    <h4 className="font-medium text-white/90 group-hover:text-primary-200 transition-colors">
                                        {item.title}
                                    </h4>
                                </div>
                                {item.achievement_id ? (
                                    <Lock className="w-4 h-4 text-white/20" />
                                    // TODO: Check if user has achievement to show unlock status
                                ) : (
                                    <Unlock className="w-4 h-4 text-emerald-500/50" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
