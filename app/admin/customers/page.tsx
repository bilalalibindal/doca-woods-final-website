import React from "react";
import { getUsersForAdmin } from "@/lib/services";
import CustomersManagement from "@/components/admin/customer/customers-management";

interface CustomersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  // Await searchParams as per Next.js 15 requirements
  const params = await searchParams;

  // Parse search params
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  // Fetch customers data
  const customersData = await getUsersForAdmin(
    page,
    20,
    search,
    sortBy,
    sortOrder
  );

  return (
    <CustomersManagement
      initialUsers={customersData.users}
      totalCount={customersData.totalCount}
      totalPages={customersData.totalPages}
      currentPage={customersData.currentPage}
      initialSearchParams={{
        search,
        sortBy,
        sortOrder,
      }}
    />
  );
}
