"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

import {
  User,
  Store,
  ShieldCheck,
  Save,
  CheckCircle2,
  Mail,
  Globe,
  Settings,
  Crown,
  Bell,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { useUpdateUserMutation } from "@/features/users/userApi";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [updateUser] = useUpdateUserMutation();

  const [state, setState] = React.useState({
    brand: "zoraMart",
    name: user?.name || "",
    email: user?.email || "",
    website: "www.zoramart.com",
    supportEmail: "support@zoramart.com",
  });

  const [saved, setSaved] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    setState((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
    }));
  }, [user]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("zoraMart:admin:settings");
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("zoraMart:admin:settings", JSON.stringify(state));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileSave = async () => {
    if (!user?.id) return;
    try {
      await updateUser({ id: user.id, name: state.name }).unwrap();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (error) {
      console.error(error);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <div className="space-y-6 font-dmsans">
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Profile & Settings
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage administrator profile, platform branding and store configuration.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p className="font-semibold capitalize">{user?.role || "Admin"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <h3 className="mt-2 text-xl font-bold">{state.brand}</h3>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3">
                <Store className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrator</p>
                <h3 className="mt-2 text-xl font-bold">{state.name}</h3>
              </div>
              <div className="rounded-2xl bg-blue-500/10 p-3">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Access Level</p>
                <h3 className="mt-2 text-xl font-bold capitalize">{user?.role || "Admin"}</h3>
              </div>
              <div className="rounded-2xl bg-yellow-500/10 p-3">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <h3 className="mt-2 text-xl font-bold text-green-600">Active</h3>
              </div>
              <div className="rounded-2xl bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Administrator Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-semibold">{state.name}</h2>
              <p className="text-muted-foreground">{state.email}</p>
              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/10 capitalize">
                {user?.role || "Administrator"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={state.name}
                onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={state.email} disabled />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profileSaved && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Profile Updated</span>
              </div>
            )}
            <Button onClick={handleProfileSave} className="gap-2">
              <Save className="h-4 w-4" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Store Branding</h3>
              <p className="text-sm text-muted-foreground">Configure global platform branding.</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Name</label>
              <Input
                value={state.brand}
                onChange={(e) => setState((prev) => ({ ...prev, brand: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input
                value={state.website}
                onChange={(e) => setState((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Support Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Support Email</h4>
                  <p className="text-xs text-muted-foreground">Customer support contact</p>
                </div>
              </div>
              <Input
                value={state.supportEmail}
                onChange={(e) => setState((prev) => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>
            <div className="rounded-2xl border p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Website Domain</h4>
                  <p className="text-xs text-muted-foreground">Public storefront</p>
                </div>
              </div>
              <Input
                value={state.website}
                onChange={(e) => setState((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-4">
              <Settings className="mb-3 h-5 w-5 text-primary" />
              <h4 className="font-medium">Configuration</h4>
              <p className="mt-1 text-sm text-muted-foreground">Platform settings are configured and active.</p>
            </div>
            <div className="rounded-2xl border p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-green-600" />
              <h4 className="font-medium">Security</h4>
              <p className="mt-1 text-sm text-muted-foreground">Administrator access is secured.</p>
            </div>
            <div className="rounded-2xl border p-4">
              <Bell className="mb-3 h-5 w-5 text-yellow-600" />
              <h4 className="font-medium">Notifications</h4>
              <p className="mt-1 text-sm text-muted-foreground">System notifications are enabled.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Save Configuration</p>
            <p className="text-sm text-muted-foreground">Platform settings are stored locally in browser storage.</p>
          </div>
          <div className="flex items-center gap-4">
            {saved && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Saved Successfully</span>
              </div>
            )}
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}