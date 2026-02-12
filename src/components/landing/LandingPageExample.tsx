"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, Headphones } from "lucide-react";

import { ChapterTreeNode, defaultChapters } from "@/components/chapters/ChapterTreeNode";
import { AudioPreviewPlayer, defaultAudioChapters } from "@/components/audio/AudioPreviewPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Landing Page Example
 * 
 * This demonstrates how both new components work together on a landing page:
 * - ChapterTreeNode: Visual progression through 12 chapters
 * - AudioPreviewPlayer: Interactive audio preview with chapter selection
 */

export function LandingPageExample() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-metal-900 via-background to-background" />
        <div className="absolute inset-0 bg-circuit opacity-50" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-metallic mb-6">
              Somatic Canticles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A transformative journey through 12 chapters aligned with your 
              physical, emotional, intellectual, and spiritual biorhythms.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="glow">
                <Sparkles className="h-5 w-5 mr-2" />
                Begin Journey
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter Tree Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-metallic mb-4">
              Your Journey Awaits
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Progress through 12 transformative chapters, each unlocking as you 
              align with your natural biorhythm cycles.
            </p>
          </div>
          
          <ChapterTreeNode chapters={defaultChapters} />
        </div>
      </section>

      {/* Audio Preview Section */}
      <section className="py-16 px-4 bg-metal-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h2 className="text-3xl font-bold text-metallic mb-4">
                Experience the Practice
              </h2>
              <p className="text-muted-foreground mb-6">
                Listen to guided somatic practices designed to harmonize your 
                body, mind, and spirit. Each chapter builds upon the previous, 
                creating a comprehensive journey of self-discovery.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card variant="glass" className="p-4">
                  <div className="text-2xl font-bold text-primary">143</div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </Card>
                <Card variant="glass" className="p-4">
                  <div className="text-2xl font-bold text-cyan-500">12</div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </Card>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Headphones className="h-4 w-4" />
                <span>High-quality audio guided practices</span>
              </div>
            </div>

            {/* Right: Audio Player */}
            <div>
              <AudioPreviewPlayer chapters={defaultAudioChapters} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Physical Cycle</h3>
              <p className="text-sm text-muted-foreground">
                Build somatic awareness and body intelligence through 
                embodied practice.
              </p>
            </Card>

            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Emotional Cycle</h3>
              <p className="text-sm text-muted-foreground">
                Develop emotional fluency and release stored tension 
                through gentle movement.
              </p>
            </Card>

            <Card variant="glass" className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Intellectual Cycle</h3>
              <p className="text-sm text-muted-foreground">
                Understand the science behind somatic practices and 
                neuroplasticity.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card variant="elevated" className="p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500" />
            
            <h2 className="text-3xl font-bold text-metallic mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of practitioners who have transformed their lives 
              through the Somatic Canticles practice.
            </p>
            <Button size="xl" variant="glow">
              <Sparkles className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Chapters 1 & 2 are free. Unlock the full journey with a subscription.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default LandingPageExample;
