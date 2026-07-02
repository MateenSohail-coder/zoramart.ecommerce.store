"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetSellerInfosQuery,
  useAddSellerInfoMutation,
} from "@/features/sellerInfo/sellerInfoApi";

const defaultForm = {
  storeName: "",
  description: "",
  logo: "https://placehold.co",
  banner: "https://placehold.co",
  businessAddress: {
    street: "",
    city: "",
    state: "",
    country: "Pakistan",
  },
  phone: "",
  cnicOrTaxId: "",
  bankDetails: {
    accountTitle: "",
    accountNumber: "",
    bankName: "",
    branchCode: "",
  },
};

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: sellerInfoDoc, isLoading } = useGetSellerInfosQuery();
  const [upsertSellerInfo, { isLoading: saving }] = useAddSellerInfoMutation();

  const [form, setForm] = React.useState(defaultForm);

  React.useEffect(() => {
    if (status !== "authenticated") return;
    // sellerInfoDoc may be null if not onboarded yet
    if (!sellerInfoDoc) return;

    // Initialize form from server data
    const nextForm = {
      storeName: sellerInfoDoc.storeName || "",
      description: sellerInfoDoc.description || "",
      logo:
        sellerInfoDoc.logo ||
        "https://res.cloudinary.com/e9wwztga/image/upload/v1782984835/zoramart/lv5yiqsqnix9vrtrj8pm.jpg",
      banner:
        sellerInfoDoc.banner ||
        "https://res.cloudinary.com/e9wwztga/image/upload/v1782985306/zoramart/eft2bvza3zfivjsp8qoq.jpg",
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
    };

    setForm(nextForm);
  }, [sellerInfoDoc, status]);

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      // Ensure nested objects exist
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

    // After onboarding completed, go to seller dashboard.
    router.push("/seller/overview");
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "seller") {
    router.replace("/");
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="text-xl">Seller Onboarding</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
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
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

            <Card className="rounded-sm border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Business Address</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card className="rounded-sm border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Bank Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Account Number
                    </label>
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
                      required
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
                      required
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
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="submit"
                className="rounded-sm bg-[#ff6f00] hover:bg-[#e66400]"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Continue"}
              </Button>
            </div>

            {/* Keep simple; once onboarding completed you can redirect to seller dashboard */}
            {isLoading && (
              <p className="text-xs text-muted-foreground">
                Loading your saved data...
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
