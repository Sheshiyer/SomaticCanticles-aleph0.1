"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Calendar, Globe } from "lucide-react";

import { register as registerUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardCorners } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LightPillar } from "@/components/effects/LightPillar";

// Password requirements matching backend
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character (!@#$%^&*)"),
    confirmPassword: z.string(),
    birthdate: z.string().optional(),
    timezone: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const timezoneOptions = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    },
  });

  const timezone = watch("timezone");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        birthdate: data.birthdate,
        timezone: data.timezone,
      });

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          Create Your Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground leading-relaxed">
          Enter your details to begin your journey
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              leftIcon={<Lock className="h-4 w-4" />}
              {...register("password")}
              disabled={isLoading}
              error={errors.password?.message}
            />
            {errors.password && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <span>•</span>
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Must be at least 12 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<Lock className="h-4 w-4" />}
              {...register("confirmPassword")}
              disabled={isLoading}
              error={errors.confirmPassword?.message}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <span>•</span>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Birthdate Field */}
          <div className="space-y-2.5">
            <Label htmlFor="birthdate" className="text-foreground">Birthdate <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              id="birthdate"
              type="date"
              leftIcon={<Calendar className="h-4 w-4" />}
              {...register("birthdate")}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Used for personalized biorhythm calculations and chapter unlocks.
            </p>
          </div>

          {/* Timezone Field */}
          <div className="space-y-2.5">
            <Label htmlFor="timezone" className="text-foreground">Timezone</Label>
            <Select
              value={timezone}
              onValueChange={(value) => setValue("timezone", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/auth/login" 
              className="text-primary font-medium hover:text-amber-400 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
