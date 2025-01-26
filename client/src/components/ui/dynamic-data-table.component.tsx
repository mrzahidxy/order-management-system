"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import privateRequest from "@/healper/privateRequest";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Button } from "./button";
import { DataTable } from "./data-table.component";
import DefaultLoader from "../common/DefaultLoacer.component";

interface DynamicTableProps<TData> {
  url: string;
  addUrl?: string;
  columns: ColumnDef<TData>[];
  title?: string;
  buttonText?: string;
  queryKey: string;
}

export function DynamicTable<TData>({
  url,
  addUrl,
  columns,
  title,
  buttonText,
  queryKey,
}: DynamicTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters with defaults
  const pageParam = parseInt(searchParams.get("page") ?? "1");
  const enabledParam = searchParams.get("enabled");
  const limit = 10;

  // Ensure page number is valid
  const page = pageParam > 0 ? pageParam : 1;

  // Function to fetch data
  const fetchData = async (page: number, limit: number) => {
    const response = await privateRequest.get(
      `${url}?page=${page}&limit=${limit}&enabled=${enabledParam}`
    );
    return response.data;
  };

  // Use React Query to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, page, enabledParam],
    queryFn: () => fetchData(page, limit),
  });

  // Extract data and pagination
  const { collections: tableData = [], pagination = null } = data?.data || {};

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <DefaultLoader showImage={false} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-red-500 text-center">
        {error instanceof Error ? error.message : "An error occurred while fetching data."}
      </div>
    );
  }


  return (
    <div className="space-y-6 flex flex-col">
      {/* Table Header */}
      {title && <h1 className="text-2xl font-bold">{title}</h1>}

      {/* Add Button */}
      {buttonText && addUrl && (
        <div className="self-end">
          <Button onClick={() => router.push(addUrl)}>{buttonText}</Button>
        </div>
      )}

      {/* Data Table */}
      <DataTable columns={columns} data={tableData} />

      {/* Pagination Controls */}
      {pagination?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
