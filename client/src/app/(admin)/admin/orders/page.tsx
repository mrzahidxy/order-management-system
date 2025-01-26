"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { StatusUpdateDialog } from "./order-status-update.component";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";

type Order = {
  id: number;
  netAmount: string;
  address: string;
  status: string;
  createdAt: string;
  user: { email: string };
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => <span>{row?.original?.user?.email}</span>,
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
  },
  {
    accessorKey: "totalDiscount",
    header: "Total Discount",
  },
  {
    accessorKey: "grandTotal",
    header: "Grand Total",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="outline">{row?.original?.status}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      let date = new Date(row?.original?.createdAt);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="text-2xl cursor-pointer">
        <StatusUpdateDialog id={row.original.id} />
      </div>
    ),
  },
];

const ProductPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        title="Orders"
        url="/orders"
        columns={columns}
        queryKey="ordersList"
      />
    </Suspense>
  );
};

export default ProductPage;
