'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LightPillar } from '@/components/effects/LightPillar';
import { createClient } from '@/lib/supabase/client';

interface OnboardingModalProps {
    open: boolean;
    onComplete: (birthdate: string) => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
    const router = useRouter();
    const [birthdate, setBirthdate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!birthdate) {
            toast.error('Please enter your birthdate');
            return;
        }

        // Validate date
        const date = new Date(birthdate);
        const today = new Date();
        const minDate = new Date('1900-01-01');

        if (date > today) {
            toast.error('Birthdate cannot be in the future');
            return;
        }

        if (date < minDate) {
            toast.error('Please enter a valid birthdate');
            return;
        }

        setIsSubmitting(true);

        try {
            // Update user metadata in Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error('Not authenticated');
            }

            const { error: updateError } = await supabase.auth.updateUser({
                data: { birthdate }
            });

            if (updateError) {
                throw updateError;
            }

            // Also update the profiles table if it exists
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    birthdate,
                    updated_at: new Date().toISOString(),
                });

            if (profileError) {
                console.error('Profile update error:', profileError);
                // Don't fail if profile update fails
            }

            toast.success('Welcome! Your profile is all set up.');
            onComplete(birthdate);
            router.refresh();
        } catch (error) {
            console.error('Onboarding error:', error);
            toast.error('Failed to save your information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                    >
                        <Card className="relative w-full max-w-md overflow-hidden border-primary/20">
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-solar-13/10 blur-3xl" />

                            <CardHeader className="relative space-y-4 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Welcome to Somatic Canticles!</CardTitle>
                                    <CardDescription className="mt-2">
                                        We need your birthdate to calculate your personalized biorhythm cycles
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="relative space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birthdate" className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4" />
                                            Your Birthdate
                                        </Label>
                                        <Input
                                            id="birthdate"
                                            type="date"
                                            value={birthdate}
                                            onChange={(e) => setBirthdate(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            min="1900-01-01"
                                            required
                                            className="w-full"
                                            disabled={isSubmitting}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This information is used to calculate your biorhythm cycles and is kept private
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Setting up...' : 'Continue to Dashboard'}
                                    </Button>
                                </form>

                                <div className="flex items-center justify-center gap-2">
                                    <LightPillar color="solar" height={24} width={2} intensity="low" />
                                    <p className="text-center text-xs text-muted-foreground">
                                        Your journey begins here
                                    </p>
                                    <LightPillar color="transform" height={24} width={2} intensity="low" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
