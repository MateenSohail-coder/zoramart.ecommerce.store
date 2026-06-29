"use client";

import * as React from "react";
import { useAddProductMutation } from "@/features/product/productApi";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

export default function SellerCreateProductPage() {
  const { data: session } = useSession();
  const { data: allCategoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery({ all: "true" });

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [uploading, setUploading] = React.useState(false);

  const allCategories = Array.isArray(allCategoriesData) ? allCategoriesData : [];
  const categories = allCategories.filter((c) => !c.parentCategory);

  const [form, setForm] = React.useState({
    name: "",
    subtitle: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subCategory: "",
    downprice: "",
    rating: 0,
  });

  const mainCategoryId = form.category || undefined;
  const subcategories = mainCategoryId
    ? allCategories.filter((c) => String(c.parentCategory) === String(mainCategoryId))
    : [];

  const [images, setImages] = React.useState([null, null, null, null]);

  const fileInputRef = React.useRef(null);
  const activeIndex = React.useRef(null);

  const openPicker = (index) => {
    activeIndex.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || activeIndex.current === null) return;

    setImages((prev) => {
      const updated = [...prev];
      updated[activeIndex.current] = file;
      return updated;
    });

    e.target.value = "";
  };

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.urls?.[0];
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("You must be logged in as a seller");
      return;
    }

    try {
      const selectedFiles = images.filter(Boolean);
      let imageUrls = [];

      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploaded = await Promise.all(
          selectedFiles.map((file) => uploadFile(file)),
        );
        imageUrls = uploaded.filter(Boolean);
        setUploading(false);
      }

      await addProduct({
        name: form.name,
        description: form.description || form.subtitle || form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        subCategory: form.subCategory || undefined,
        seller: session.user.id,
        images: imageUrls.length > 0
          ? imageUrls
          : ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&auto=format&fit=crop"],
        downprice: form.downprice ? Number(form.downprice) : undefined,
      }).unwrap();

      toast.success("Product created successfully");

      setForm({
        name: "",
        subtitle: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subCategory: "",
        downprice: "",
        rating: 0,
      });

      setImages([null, null, null, null]);
    } catch {
      setUploading(false);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="space-y-6 font-dmsans">
      {/* HEADER */}
      <div className="rounded-sm border bg-[#ff6f00] p-5 text-white">
        <h1 className="text-xl font-semibold">Create Product</h1>
        <p className="text-xs text-white/80">
          Add product with images and category details
        </p>
      </div>

      {/* FORM */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill all required fields carefully</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {/* NAME */}
            <Input
              placeholder="Product name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                }))
              }
              required
            />

            {/* SUBTITLE */}
            <Input
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  subtitle: e.target.value,
                }))
              }
            />

            {/* DESCRIPTION */}
            <Textarea
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
            />

            {/* PRICE + DOWNPRICE + STOCK */}
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: e.target.value,
                  }))
                }
                required
              />

              <Input
                type="number"
                placeholder="Original Price (was)"
                value={form.downprice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    downprice: e.target.value,
                  }))
                }
              />

              <Input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stock: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* CATEGORY */}
            {categoriesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    category: value,
                    subCategory: "",
                  }))
                }
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* SUB CATEGORY */}
            {categoriesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={form.subCategory}
                onValueChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    subCategory: value,
                  }))
                }
                disabled={!form.category || subcategories.length === 0}
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>

                <SelectContent>
                  {subcategories.map((sc) => (
                    <SelectItem key={sc._id || sc.id} value={sc._id || sc.id}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* IMAGE UPLOAD GRID */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => openPicker(i)}
                  className="flex h-24 cursor-pointer items-center justify-center rounded-sm border border-dashed bg-gray-50 text-xs text-gray-500 hover:border-[#ff6f00]"
                >
                  {img ? (
                    <img
                      src={URL.createObjectURL(img)}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  ) : (
                    "+ Add"
                  )}
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isLoading || uploading}
              className="w-full bg-[#ff6f00] hover:bg-[#e66000] rounded-sm"
            >
              {uploading ? "Uploading images..." : isLoading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
