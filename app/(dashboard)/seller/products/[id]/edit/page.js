"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import {
  useGetProductQuery,
  useUpdateProductsMutation,
} from "@/features/product/productApi";

import { useGetCategoriesQuery } from "@/features/categories/categoryApi";

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
import { X, Upload } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

export default function SellerEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: product, isLoading: productsLoading } = useGetProductQuery(
    { id },
    { skip: !id },
  );

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductsMutation();

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const [form, setForm] = React.useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    rating: 0,
  });

  const [existingImages, setExistingImages] = React.useState([]);
  const [newFiles, setNewFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      category: product.category?._id || product.category || "",
      rating: product.rating ?? 0,
    });

    setExistingImages(product.images || []);
  }, [product]);

  const removeExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
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

    if (!product?._id) return;

    try {
      let uploadedUrls = [];

      if (newFiles.length > 0) {
        setUploading(true);
        const uploaded = await Promise.all(
          newFiles.map((file) => uploadFile(file)),
        );
        uploadedUrls = uploaded.filter(Boolean);
        setUploading(false);
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        rating: Number(form.rating || 0),
        images: allImages,
      };

      await updateProduct({
        id: product._id,
        ...payload,
      }).unwrap();

      toast.success("Product updated successfully");
      router.push("/seller/products");
    } catch {
      setUploading(false);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="space-y-6 font-dmsans">
      <div className="rounded-sm border bg-[#ff6f00] p-6 text-white">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="mt-1 text-sm text-white/80">
          Update product details, images and inventory
        </p>
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Modify your product details below</CardDescription>
        </CardHeader>

        <CardContent>
          {productsLoading || !product ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        price: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((f) => ({
                        ...f,
                        category: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="group relative">
                      <img
                        src={url}
                        alt=""
                        className="h-24 w-full rounded-sm object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:block"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {newFiles.map((file, i) => (
                    <div key={`new-${i}`} className="group relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="h-24 w-full rounded-sm object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 cursor-pointer items-center justify-center rounded-sm border border-dashed bg-gray-50 text-xs text-gray-500 hover:border-[#ff6f00]"
                  >
                    <Upload className="mr-1 h-4 w-4" />
                    Add
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAddFiles}
                />
              </div>

              <Button
                type="submit"
                disabled={isUpdating || uploading}
                className="w-full bg-[#ff6f00] hover:bg-[#e66000]"
              >
                {uploading ? "Uploading images..." : isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
