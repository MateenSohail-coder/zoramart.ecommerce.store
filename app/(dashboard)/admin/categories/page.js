"use client";

import * as React from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Search,
  Hash,
} from "lucide-react";

import {
  useGetCategoriesQuery,
  useAddProductMutation,
  useDeleteCategoriesMutation,
} from "@/features/categories/categoryApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: allCategories = [], isLoading } = useGetCategoriesQuery({ all: "true" });

  const [addCategory] = useAddProductMutation();
  const [deleteCategory] = useDeleteCategoriesMutation();

  const [search, setSearch] = React.useState("");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [form, setForm] = React.useState({ name: "", parentCategory: "none" });

  const rootCategories = allCategories.filter((c) => !c.parentCategory);

  const getSubcategories = (parentId) =>
    allCategories.filter((c) => c.parentCategory === parentId);

  const filteredRoot = rootCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenAdd = (parentId = "none") => {
    setForm({ name: "", parentCategory: parentId });
    setShowAddDialog(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const parentCat = form.parentCategory && form.parentCategory !== "none"
        ? allCategories.find((c) => c._id === form.parentCategory)
        : null;
      const body = {
        name: form.name.trim(),
        parentCategory: parentCat?._id || null,
        level: parentCat ? Math.min(parentCat.level + 1, 3) : 1,
      };
      await addCategory(body).unwrap();
      toast.success(
        body.parentCategory
          ? "Subcategory added successfully"
          : "Category added successfully",
      );
      setShowAddDialog(false);
      setForm({ name: "", parentCategory: "none" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory({ id: deleteTarget._id }).unwrap();
      toast.success(
        `"${deleteTarget.name}" deleted successfully`,
      );
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to delete category",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 font-dmsans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#ff6f00]" />
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage main categories and subcategories
          </p>
        </div>
        <Button
          onClick={() => handleOpenAdd("none")}
          className="bg-[#ff6f00] hover:bg-[#e66400] rounded-lg gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Main Category
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-lg"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : filteredRoot.length === 0 ? (
        <Card className="rounded-lg">
          <CardContent className="py-12 text-center">
            <FolderTree className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">
              {search
                ? "No categories match your search"
                : "No categories yet. Add your first main category!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRoot.map((cat) => (
            <CategoryRow
              key={cat._id}
              category={cat}
              subcategories={getSubcategories(cat._id)}
              onAddSub={(parentId) => handleOpenAdd(parentId || cat._id)}
              onDelete={(c) => setDeleteTarget(c)}
              allCategories={allCategories}
            />
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {form.parentCategory && form.parentCategory !== "none"
                ? "Add Subcategory"
                : "Add Main Category"}
            </DialogTitle>
            <DialogDescription>
              {form.parentCategory && form.parentCategory !== "none"
                ? "Create a new subcategory under the selected parent."
                : "Create a new top-level main category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {form.parentCategory && form.parentCategory !== "none" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Category</label>
                <Select
                  value={form.parentCategory}
                  onValueChange={(val) =>
                    setForm((s) => ({ ...s, parentCategory: val }))
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rootCategories.map((rc) => (
                      <SelectItem key={rc._id} value={rc._id}>
                        {rc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {form.parentCategory && form.parentCategory !== "none"
                  ? "Subcategory Name"
                  : "Category Name"}
              </label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="e.g. Electronics, Clothing..."
                required
                className="rounded-lg"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.name.trim()}
                className="bg-[#ff6f00] hover:bg-[#e66400] rounded-lg"
              >
                {submitting
                  ? "Adding..."
                  : form.parentCategory && form.parentCategory !== "none"
                    ? "Add Subcategory"
                    : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Category"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}

function CategoryRow({
  category,
  subcategories,
  onAddSub,
  onDelete,
  allCategories,
}) {
  const [expanded, setExpanded] = React.useState(true);

  const getSubSubcategories = (parentId) =>
    allCategories.filter((c) => c.parentCategory === parentId);

  return (
    <Card className="rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-card">
        <div className="flex items-center gap-3 min-w-0">
          {subcategories.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {subcategories.length === 0 && (
            <span className="w-4 shrink-0" />
          )}
          <FolderTree className="w-5 h-5 text-[#ff6f00] shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-sm">{category.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              /{category.slug}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 font-mono"
          >
            <Hash className="w-2.5 h-2.5 mr-0.5" />
            {category.level}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 font-medium"
          >
            {subcategories.length} sub
          </Badge>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddSub}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-[#ff6f00]"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expanded && subcategories.length > 0 && (
        <div className="border-t bg-muted/20">
          {subcategories.map((sub) => {
            const subSubs = getSubSubcategories(sub._id);
            return (
              <SubcategoryRow
                key={sub._id}
                category={sub}
                subcategories={subSubs}
                onAddSub={onAddSub}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
}

function SubcategoryRow({ category, subcategories, onAddSub, onDelete }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-3 pl-12 hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          {subcategories.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          {subcategories.length === 0 && (
            <span className="w-3.5 shrink-0" />
          )}
          <div className="w-2 h-2 rounded-full bg-[#ff6f00]/60 shrink-0" />
          <div className="min-w-0">
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              /{category.slug}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 font-mono"
          >
            L{category.level}
          </Badge>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSub(category._id)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-[#ff6f00]"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {expanded && subcategories.length > 0 && (
        <div className="bg-muted/10">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between px-5 py-3 pl-20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm">{sub.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    /{sub.slug}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-mono"
                >
                  L{sub.level}
                </Badge>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(sub)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
