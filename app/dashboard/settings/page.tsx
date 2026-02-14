"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2, User, Lock, Trash2, Eye, EyeOff, Mail, Calendar, Shield, Globe, KeyRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  birthdate: z.string().optional(),
  timezone: z.string(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character (!@#$%^&*)"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface UserData {
  id: string;
  email: string;
  role: string;
  birthdate?: string;
  timezone?: string;
  createdAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const timezones = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Anchorage", "America/Honolulu", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Europe/Moscow", "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Singapore",
  "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Australia/Perth", "Australia/Sydney",
  "Pacific/Auckland",
];

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { birthdate: "", timezone: "UTC" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const tokens = typeof window !== "undefined" ? localStorage.getItem("auth_tokens") : null;
      if (!tokens) { setIsLoadingUser(false); return; }

      try {
        const { accessToken } = JSON.parse(tokens);
        setIsLoadingUser(true);
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        if (data.success) {
          const userData = data.data.user;
          setUser(userData);
          profileForm.reset({
            birthdate: userData.birthdate || "",
            timezone: userData.timezone || "UTC",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchProfile();
  }, []);

  const onProfileSubmit = async (data: ProfileFormData) => {
    const tokens = typeof window !== "undefined" ? localStorage.getItem("auth_tokens") : null;
    if (!tokens) return;

    setIsLoadingProfile(true);
    try {
      const { accessToken } = JSON.parse(tokens);
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated successfully");
        const updatedUser = { ...user, ...result.data.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(result.error?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    const tokens = typeof window !== "undefined" ? localStorage.getItem("auth_tokens") : null;
    if (!tokens) return;

    setIsLoadingPassword(true);
    try {
      const { accessToken } = JSON.parse(tokens);
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.data.message);
        passwordForm.reset();
        setActiveTab("profile");
      } else {
        toast.error(result.error?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const tokens = typeof window !== "undefined" ? localStorage.getItem("auth_tokens") : null;
    if (!tokens) return;

    try {
      const { accessToken } = JSON.parse(tokens);
      const response = await fetch(`${API_BASE_URL}/user/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("auth_tokens");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        toast.error(result.error?.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-metallic">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-metal-800/50 p-1">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-metal-700">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2 data-[state=active]:bg-metal-700">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2 data-[state=active]:bg-metal-700">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Danger</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Account Info Card */}
          <Card variant="glass" noPadding className="border-metal-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-metallic">
                <Mail className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and membership information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email Address</Label>
                  <div className="flex items-center gap-3 rounded-lg border border-metal-700 bg-metal-800/50 px-4 py-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email || "Not available"}</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Account Type</Label>
                  <div className="flex items-center gap-3 rounded-lg border border-metal-700 bg-metal-800/50 px-4 py-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{user?.role || "User"}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
              {user?.createdAt && (
                <div className="space-y-2.5">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Member Since</Label>
                  <div className="flex items-center gap-3 rounded-lg border border-metal-700 bg-metal-800/50 px-4 py-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Edit Card */}
          <Card variant="glass" noPadding className="border-metal-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-metallic">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your profile information for personalized biorhythm calculations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="birthdate">Birthdate</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="birthdate"
                        type="date"
                        className="pl-10"
                        {...profileForm.register("birthdate")}
                        error={profileForm.formState.errors.birthdate?.message}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Used for personalized biorhythm calculations and chapter unlocks.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileForm.watch("timezone")}
                      onValueChange={(v) => profileForm.setValue("timezone", v)}
                    >
                      <SelectTrigger className="pl-10">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Used for accurate daily biorhythm snapshots and sunrise calculations.
                    </p>
                  </div>
                </div>
                <Separator className="bg-metal-700/50" />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoadingProfile || !profileForm.formState.isDirty}
                    shine
                  >
                    {isLoadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <Card variant="glass" noPadding className="border-metal-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-metallic">
                <KeyRound className="h-5 w-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure. You will be signed out of all devices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                {/* Current Password */}
                <div className="space-y-2.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="Enter current password"
                      {...passwordForm.register("currentPassword")}
                      error={passwordForm.formState.errors.currentPassword?.message}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="bg-metal-700/50" />

                {/* New Password */}
                <div className="space-y-2.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="Create new password"
                      {...passwordForm.register("newPassword")}
                      error={passwordForm.formState.errors.newPassword?.message}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Must be at least 12 characters with uppercase, lowercase, number, and special character.
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="Confirm new password"
                      {...passwordForm.register("confirmPassword")}
                      error={passwordForm.formState.errors.confirmPassword?.message}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="bg-metal-700/50" />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoadingPassword || !passwordForm.formState.isDirty}
                    shine
                  >
                    {isLoadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card variant="glass" noPadding className="border-rose-500/30 bg-rose-950/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-rose-400">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions. Proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium text-rose-400">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data:
                    </p>
                    <ul className="ml-4 list-disc text-sm text-muted-foreground space-y-0.5">
                      <li>Your profile and progress</li>
                      <li>Chapter completion records</li>
                      <li>Biorhythm history</li>
                      <li>Achievements and streaks</li>
                    </ul>
                  </div>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="shrink-0 h-11">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-rose-500/30">
                      <DialogHeader>
                        <DialogTitle className="text-rose-400 flex items-center gap-2">
                          <Trash2 className="h-5 w-5" />
                          Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription className="space-y-2">
                          <p>This action cannot be undone. This will permanently delete your account.</p>
                          <p className="font-medium text-foreground">{user?.email}</p>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Yes, Delete My Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
