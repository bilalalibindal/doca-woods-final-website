"use client";

import { useState } from "react";
import Image from "next/image";

// shadcn/ui ve lucide-react bileşenleri
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";

// Kendi bileşenleriniz ve fonksiyonlarınız
import { ProductForm } from "@/components/admin/product/product-form";
import { deleteProduct } from "@/lib/admin-actions";
import type { Product, Category } from "@/types/admin";
import { toast } from "react-toastify";
import { toastAlert } from "@/components/toastAlert";

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Arama ve kategoriye göre ürünleri filtrele
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ürün silme fonksiyonu
  const handleDelete = async (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      const result = await deleteProduct(id);
      toastAlert(result);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtreleme Alanı */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Ürün adı veya SKU ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Kategoriye göre filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ürün Tablosu */}
      <div className="border rounded-lg">
        <Table>
          {/* Görseldeki gibi başlıkları düzenledik */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">ÜRÜN</TableHead>
              <TableHead>KATEGORİ</TableHead>
              <TableHead>FİYAT</TableHead>
              <TableHead>STOK DURUMU</TableHead>
              <TableHead className="text-right">EYLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  {/* 1. ÜRÜN SÜTUNU: Resim, Ürün Adı ve SKU */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={product.images[0] ?? "/placeholder.png"}
                        alt={product.name}
                        width={75}
                        height={75}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">{product.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.sku}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. KATEGORİ SÜTUNU: Rozet (Badge) içinde */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      {product.category?.name || "N/A"}
                    </Badge>
                  </TableCell>

                  {/* 3. FİYAT SÜTUNU: Türk Lirası formatında */}
                  <TableCell>
                    {product.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </TableCell>

                  {/* 4. STOK DURUMU SÜTUNU: Rozet (Badge) içinde */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.inStock
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {product.inStock ? "Stokta" : "Tükendi"}
                    </Badge>
                  </TableCell>

                  {/* 5. EYLEMLER (ACTIONS) SÜTUNU: Düzenle/Sil */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
                        <ProductForm
                          product={product}
                          categories={categories}
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
