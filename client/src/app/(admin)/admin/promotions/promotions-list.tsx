"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { EditIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import privateRequest from "@/healper/privateRequest";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryClient from "@/config/queryClient";

interface Promotion {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  discount: number | null;
  slabs: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  products: {
    id: string;
    promotionId: string;
    productId: string;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      weight: number;
      enabled: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
}

// Define the columns for the DataTable
const PromotionList: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("enabled") || "true"; // Default to "active" products

  // Handles product status changes
  const handlePromotionStatusChange = async (
    promotionId: string,
    currentStatus: boolean
  ) => {
  
    try {
      // Toggle the product status
      const updatedStatus = !currentStatus;
      await privateRequest.patch(`/promotions/${promotionId}/status`, {
        enabled: updatedStatus,
      });

      // Display success toast
      toast({
        title: "Success",
        description: `Promotion has been ${
          updatedStatus ? "enabled" : "disabled"
        } successfully.`,
      });

      // Refresh the current page
      // router.refresh();
      const params = new URLSearchParams(searchParams as any);
      const queryParam =
        params.get("enabled") === "true"
          ? "activePromotionsList"
          : "inactivePromotionsList";
      queryClient.invalidateQueries({ queryKey: [queryParam] });
    } catch (error) {
      console.error("Error updating promotion status:", error);
      toast({
        title: "Error",
        description: "Failed to update promotion status. Please try again.",
      });
    }
  };

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type.toLowerCase()}</span>
      ),
    },
    {
      accessorKey: "slabs",
      header: "Slabs",
      cell: ({ row }) => {
        const slabs = row.original.slabs ? JSON.parse(row.original.slabs) : [];
        if (slabs.length === 0) return "N/A";
        return (
          <ul className="list-disc pl-4">
            {slabs.map((slab: any, index: number) => (
              <li key={index}>
                {slab.minWeight}g -{" "}
                {slab.maxWeight ? `${slab.maxWeight}g` : "Above"}:{" "}
                {slab.discountPerUnit} per unit
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => (
        <span
          className={row.original.enabled ? "text-green-500" : "text-red-500"}
        >
          {row.original.enabled ? "Enabled" : "Disabled"}
        </span>
      ),
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => (
        <ul className="list-disc pl-4">
          {row.original.products.map((product) => (
            <li key={product.product.id}>
              {product.product.name} - {product.product.description}
            </li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* Edit Link */}
          <Link href={`/admin/promotions/edit/${row.original.id}`}>
            <EditIcon />
          </Link>

          {/* Enable/Disable Toggle */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <EyeIcon className="cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to{" "}
                  {row.original.enabled ? "disable" : "enable"} this promotion?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                onClick={() =>
                  handlePromotionStatusChange(row.original.id, row.original.enabled)
                }
                >
                  {row.original.enabled ? "Disable" : "Enable"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },

  ];

  // Handles tab changes by updating the query parameters
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("enabled", value); // Update the "enabled" query param
    params.set("page", "1"); // Reset to the first page
    router.push(`${pathname}?${params.toString()}`); // Navigate with updated params
  };

  // Sets the initial query parameters on component mount
  useEffect(() => {
    if (!searchParams.has("enabled")) {
      const params = new URLSearchParams(searchParams as any);
      params.set("enabled", "true"); // Default to "active" products
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs
        defaultValue={currentTab} // Sync tabs with query params
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="true">Active</TabsTrigger>
          <TabsTrigger value="false">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="true">
          <DynamicTable<Promotion>
            title="Active Promotions"
            url="/promotions"
            buttonText="Add Promotion"
            addUrl="/admin/promotions/add"
            columns={columns}
            queryKey="activePromotionsList"
          />
        </TabsContent>
        <TabsContent value="false">
          <DynamicTable<Promotion>
            title="Inactive Promotions"
            url="/promotions"
            buttonText="Add promotion"
            addUrl="/admin/promotions/add"
            columns={columns}
            queryKey="inactivePromotionsList"
          />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
};

export default PromotionList;
