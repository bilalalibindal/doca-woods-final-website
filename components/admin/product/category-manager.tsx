// CategoryManager.tsx DOSYASININ TAMAMI

"use client";

import React, { useState, useRef } from "react";
import type { Category } from "@/types/admin";
import { toast } from "react-toastify"; // Toast'u import et

// shadcn/ui Bileşenleri
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Server Actions
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";

// İkonlar
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface CategoryManagerProps {
  categories: Category[];
  trigger: React.ReactNode;
}

export function CategoryManager({ categories, trigger }: CategoryManagerProps) {
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "add" | "edit" | null;
    category: Category | null;
  }>({ open: false, mode: null, category: null });

  const formRef = useRef<HTMLFormElement>(null);

  const handleAddNew = () =>
    setModalState({ open: true, mode: "add", category: null });
  const handleEdit = (category: Category) =>
    setModalState({ open: true, mode: "edit", category });

  const closeModal = () => {
    setModalState({ open: false, mode: null, category: null });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    const formData = new FormData(event.currentTarget);
    let response;

    if (modalState.mode === "add") {
      response = await createCategory(formData);
    } else if (modalState.mode === "edit" && modalState.category) {
      response = await updateCategory(modalState.category.id, formData);
    } else {
      return;
    }

    if (response.success) {
      toast.success(response.message);
      closeModal();
    } else {
      toast.error(response.message);
    }
  };

  const handleDelete = async () => {
    if (!modalState.category) return;

    if (
      confirm(
        `'${modalState.category.name}' kategorisini silmek istediğinizden emin misiniz?`
      )
    ) {
      const response = await deleteCategory(modalState.category.id);
      if (response.success) {
        toast.success(response.message);
        closeModal();
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onSelect={() => handleEdit(category)}
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              <span>{category.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleAddNew}>
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            <span>Add New Category</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={modalState.open}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalState.mode === "add" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={modalState.category?.name ?? ""}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              {modalState.mode === "edit" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  <TrashIcon className="w-4 h-4 mr-2" /> Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {modalState.mode === "add" ? "Save Category" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
