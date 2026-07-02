"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Upload,
  Store,
  MapPin,
  Phone,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  useGetSellerInfosQuery,
  useAddSellerInfoMutation,
  useUpdateSellerInfoMutation,
} from "@/features/sellerInfo/sellerInfoApi";
import Image from "next/image";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-sm" />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="rounded-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="mx-auto h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-5 w-40" />
                <Skeleton className="mx-auto h-4 w-28" />
              </div>
              <Separator />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <Skeleton className="h-28 w-full rounded-md" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-xl bg-orange-100 p-2 text-[#ff6f00]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export default function SellerShopSettingsPage() {
  const router = useRouter();
  const { data: session, update: updateSession, status } = useSession();
  const user = session?.user;

  const { data: sellerInfoDoc, isLoading } = useGetSellerInfosQuery();
  const [upsertSellerInfo, { isLoading: saving }] = useAddSellerInfoMutation();

  const [updateSellerInfoField] = useUpdateSellerInfoMutation();

  const [uploadingImage, setUploadingImage] = React.useState(null);
  const logoInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);

  const [form, setForm] = React.useState({
    storeName: "",
    description: "",
    logo: null,
    banner: null,
    businessAddress: { street: "", city: "", state: "", country: "Pakistan" },
    phone: "",
    cnicOrTaxId: "",
    bankDetails: {
      accountTitle: "",
      accountNumber: "",
      bankName: "",
      branchCode: "",
    },
  });
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.urls?.[0];
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(field);
      const url = await uploadImage(file);
      setForm((s) => ({ ...s, [field]: url }));
      await updateSellerInfoField({ id: null, [field]: url }).unwrap();
      await updateUser({ id: user.id, image: url }).unwrap();
      await updateSession({ image: url });
      const label = field === "logo" ? "Logo" : "Banner";
      toast.success(`${label} uploaded and saved`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(null);
      e.target.value = "";
    }
  };

  React.useEffect(() => {
    if (status !== "authenticated") return;
    if (!sellerInfoDoc) return;
    setForm({
      storeName: sellerInfoDoc.storeName || "",
      description: sellerInfoDoc.description || "",
      logo: sellerInfoDoc.logo || null,
      banner: sellerInfoDoc.banner || null,
      businessAddress: {
        street: sellerInfoDoc.businessAddress?.street || "",
        city: sellerInfoDoc.businessAddress?.city || "",
        state: sellerInfoDoc.businessAddress?.state || "",
        country: sellerInfoDoc.businessAddress?.country || "Pakistan",
      },
      phone: sellerInfoDoc.phone || "",
      cnicOrTaxId: sellerInfoDoc.cnicOrTaxId || "",
      bankDetails: {
        accountTitle: sellerInfoDoc.bankDetails?.accountTitle || "",
        accountNumber: sellerInfoDoc.bankDetails?.accountNumber || "",
        bankName: sellerInfoDoc.bankDetails?.bankName || "",
        branchCode: sellerInfoDoc.bankDetails?.branchCode || "",
      },
    });
  }, [sellerInfoDoc, status]);

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "seller") {
      router.replace("/");
    }
  }, [session?.user, status, router]);

  async function onSave(e) {
    e.preventDefault();

    const payload = {
      ...form,
      businessAddress: {
        street: form.businessAddress.street,
        city: form.businessAddress.city,
        state: form.businessAddress.state,
        country: form.businessAddress.country || "Pakistan",
      },
      bankDetails: {
        accountTitle: form.bankDetails.accountTitle,
        accountNumber: form.bankDetails.accountNumber,
        bankName: form.bankDetails.bankName,
        branchCode: form.bankDetails.branchCode,
      },
    };

    await upsertSellerInfo(payload).unwrap();
    toast.success("Seller profile updated");
    router.refresh();
  }

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  if (!session?.user || session.user.role !== "seller") {
    return null;
  }

  const initials = form.storeName
    ? form.storeName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-sm border">
          <div className="relative h-48 w-full bg-transparent bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10" />

            {form.banner ? (
              <img
                src={form.banner}
                alt="banner"
                className="absolute inset-0 z-20 h-full w-full object-cover"
              />
            ) : null}
          </div>

          <CardContent className="relative px-6 pb-6 pt-0">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="h-28 w-28 rounded-sm">
                  {form.logo ? (
                    <AvatarImage
                      src={form.logo}
                      alt={form.storeName || "Seller"}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-sm text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold tracking-tight">
                      {form.storeName || "Seller Store"}
                    </h1>
                    <Badge className="bg-emerald-500 rounded-sm text-white hover:bg-emerald-500">
                      <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                      Verified Seller
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your public shop profile, contact details, and payout
                    info.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={uploadingImage === "banner"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingImage === "banner"
                    ? "Uploading..."
                    : "Change Banner"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingImage === "logo"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingImage === "logo" ? "Uploading..." : "Change Logo"}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs text-muted-foreground">Store Name</p>
                <p className="mt-1 font-medium">{form.storeName || "-"}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-1 font-medium">{form.phone || "-"}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="mt-1 font-medium">
                  {form.businessAddress.city || "-"},{" "}
                  {form.businessAddress.country || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <input
          type="file"
          accept="image/*"
          ref={logoInputRef}
          className="hidden"
          onChange={(e) => handleImageUpload(e, "logo")}
        />
        <input
          type="file"
          accept="image/*"
          ref={bannerInputRef}
          className="hidden"
          onChange={(e) => handleImageUpload(e, "banner")}
        />

        <form
          onSubmit={onSave}
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-xl">Shop Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <SectionTitle
                    icon={Store}
                    title="Store Details"
                    desc="Your shop name and public description."
                  />
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Store Name</label>
                      <Input
                        value={form.storeName}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, storeName: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            description: e.target.value,
                          }))
                        }
                        className="min-h-28"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <SectionTitle
                  icon={MapPin}
                  title="Business Address"
                  desc="Used for invoices, shipping, and seller verification."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">Street</label>
                    <Input
                      value={form.businessAddress.street}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress,
                            street: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={form.businessAddress.city}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress,
                            city: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input
                      value={form.businessAddress.state}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress,
                            state: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      value={form.businessAddress.country}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          businessAddress: {
                            ...s.businessAddress,
                            country: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-xl">Contact & Payouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <SectionTitle
                  icon={Phone}
                  title="Contact Information"
                  desc="Reachable details for customers and support."
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNIC / Tax ID</label>
                  <Input
                    value={form.cnicOrTaxId}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, cnicOrTaxId: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <SectionTitle
                  icon={CreditCard}
                  title="Bank Details"
                  desc="Used for settlements and payouts."
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Title</label>
                  <Input
                    value={form.bankDetails.accountTitle}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        bankDetails: {
                          ...s.bankDetails,
                          accountTitle: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    value={form.bankDetails.accountNumber}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        bankDetails: {
                          ...s.bankDetails,
                          accountNumber: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    value={form.bankDetails.bankName}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        bankDetails: {
                          ...s.bankDetails,
                          bankName: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch Code</label>
                  <Input
                    value={form.bankDetails.branchCode}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        bankDetails: {
                          ...s.bankDetails,
                          branchCode: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="rounded-xl bg-[#ff6f00] hover:bg-[#e66400]"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              {isLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading your saved data...
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
