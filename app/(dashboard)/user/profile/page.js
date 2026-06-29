"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

import {
  User,
  Phone,
  MapPin,
  Mail,
  Camera,
  Package,
  Heart,
  Star,
  Save,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useUpdateUserMutation } from "@/features/users/userApi";

export default function UserProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const { data: ordersData } = useGetOrdersQuery({ page: 1, limit: 1 });
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const ordersCount = ordersData?.total ?? 0;

  const [profile, setProfile] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const [saved, setSaved] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const avatarInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
    }));
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploadingAvatar(true);
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      const url = data.urls?.[0];
      if (!url) throw new Error("Upload failed");

      await updateUser({ id: user.id, image: url }).unwrap();
      await updateSession({ name: profile.name, image: url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await updateUser({ id: user.id, name: profile.name }).unwrap();
      await updateSession({ name: profile.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
    : "U";

  const wishlistCount = 0;

  return (
    <div className="space-y-6">
      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="group relative"
              >
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-white text-xl font-bold text-[#ff6f00]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {profile.name || "My Account"}
              </h1>
              <p className="text-orange-100">
                {profile.email || "Manage your personal information"}
              </p>
            </div>
          </div>

          <Badge className="rounded-sm bg-white text-[#ff6f00] capitalize">
            {user?.role || "Buyer"}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Package className="h-10 w-10 text-[#ff6f00]" />
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>
              <h3 className="text-2xl font-bold">{ordersCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Heart className="h-10 w-10 text-[#ff6f00]" />
            <div>
              <p className="text-sm text-muted-foreground">Wishlist</p>
              <h3 className="text-2xl font-bold">{wishlistCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Star className="h-10 w-10 text-[#ff6f00]" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <h3 className="text-2xl font-bold text-sm">—</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>
                <Input
                  className="rounded-sm"
                  placeholder="Your name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  className="rounded-sm"
                  value={profile.email}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  className="rounded-sm"
                  placeholder="+92 300 1234567"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Delivery Address
                </label>
                <Textarea
                  className="rounded-sm"
                  rows={5}
                  placeholder="Enter your complete address..."
                  value={profile.address}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center gap-4">
                {saved && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Saved</span>
                  </div>
                )}
                <Button
                  className="rounded-sm bg-[#ff6f00] hover:bg-[#e66400]"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span>{user?.name ? "100%" : "50%"}</span>
                  </div>
                  <div className="h-2 rounded-sm bg-muted">
                    <div
                      className={`h-2 rounded-sm bg-[#ff6f00] ${user?.name ? "w-full" : "w-1/2"}`}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {user?.email ? "Email Verified" : "Email Not Verified"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-[#ff6f00]" />
                  <span className="text-sm capitalize">{user?.role || "Buyer"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full rounded-sm">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
