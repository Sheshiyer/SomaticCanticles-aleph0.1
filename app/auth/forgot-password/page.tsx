"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";

import { forgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardCorners } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LightPillar } from "@/components/effects/LightPillar";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await forgotPassword({ email: data.email });
      setIsSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card 
        variant="success" 
        className="w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <CardCorners color="emerald" />
        
        {/* Top tech accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-32 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        <CardHeader className="space-y-4 text-center pb-6 pt-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            Check Your Email
          </CardTitle>
          <CardDescription className="leading-relaxed">
            We&apos;ve sent a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you don&apos;t see the email, check your spam folder or wait a few minutes.
          </p>
        </CardContent>
        <CardFooter className="pt-2">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full h-11 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card 
      variant="glass" 
      className="w-full border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-primary/30 transition-all duration-300"
    >
      <CardCorners color="primary" />
      
      {/* Top tech accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <CardHeader className="space-y-4 pb-6 pt-8">
        {/* Light pillar accent */}
        <div className="flex justify-center mb-2">
          <LightPillar color="solar" height={32} width={2} intensity="low" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground leading-relaxed">
          Enter your email address and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              {...register("email")}
              disabled={isLoading}
              error={errors.email?.message}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <span>•</span>
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button 
            type="submit" 
            className="w-full h-11" 
            disabled={isLoading}
            shine
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
