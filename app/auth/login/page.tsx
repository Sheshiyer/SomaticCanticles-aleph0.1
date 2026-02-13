"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";

import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardCorners } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LightPillar } from "@/components/effects/LightPillar";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Welcome back!");
      router.refresh(); // Update client-side session state
      router.push(callbackUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid email or password";
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
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground leading-relaxed">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                {...register("email")}
                disabled={isLoading}
                error={errors.email?.message}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <span>•</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:text-amber-400 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
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
          </div>

          {/* Remember Me - PROPERLY SPACED */}
          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none cursor-pointer select-none text-foreground"
              >
                Remember me for 30 days
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stay signed in on this device
              </p>
            </div>
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium hover:text-amber-400 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
