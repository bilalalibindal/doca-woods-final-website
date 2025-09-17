import React from "react";
import { getOrdersForAdmin } from "@/lib/services";
import OrdersManagement from "@/components/admin/order/orders-management";

// Admin sayfası dinamik olmalı
export const dynamic = 'force-dynamic';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  // Await searchParams as per Next.js 15 requirements
  const params = await searchParams;

  // Parse search params
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const status = params.status || "all";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  // Fetch orders data
  const ordersData = await getOrdersForAdmin(
    page,
    20,
    search,
    status,
    sortBy,
    sortOrder
  );

  return (
    <OrdersManagement
      initialOrders={ordersData.orders}
      totalCount={ordersData.totalCount}
      totalPages={ordersData.totalPages}
      currentPage={ordersData.currentPage}
      initialSearchParams={{
        search,
        status,
        sortBy,
        sortOrder,
      }}
    />
  );
}
