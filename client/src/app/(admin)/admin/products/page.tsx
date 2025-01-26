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

// Define the product interface to type the data
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  enabled: boolean;
  createdAt: string;
  updateAt: string;
}

// Define the columns for the DataTable
const ProductPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("enabled") || "true"; // Default to "active" products

  // Handles product status changes
  const handleProductStatusChange = async (productId: number, currentStatus: boolean) => {
    try {
      // Toggle the product status
      const updatedStatus = !currentStatus;
      await privateRequest.patch(`/products/${productId}/status`, {
        enabled: updatedStatus,
      });

      // Display success toast
      toast({
        title: "Success",
        description: `Product has been ${updatedStatus ? "enabled" : "disabled"} successfully.`,
      });

      // Refresh the current page
      // router.refresh();
      const params = new URLSearchParams(searchParams as any);
      const queryParam = params.get("enabled") === "true" ? "activeProductsList" : "inactiveProductsList";
      queryClient.invalidateQueries({ queryKey: [queryParam] });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
      });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => (
        <span className={row.original.enabled ? "text-green-500" : "text-red-500"}>
          {row.original.enabled ? "Enabled" : "Disabled"}
        </span>
      ),
    },
    {
      accessorKey: "weight",
      header: "Weight",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/admin/products/edit/${row.original.id}`}>
            <EditIcon />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <EyeIcon className="cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {row.original.enabled ? "disable" : "enable"} this product?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleProductStatusChange(row.original.id, row.original.enabled)}
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
          <DynamicTable<Product>
            title="Active Products"
            url="/products"
            buttonText="Add Product"
            addUrl="/admin/products/add"
            columns={columns}
            queryKey="activeProductsList"
          />
        </TabsContent>
        <TabsContent value="false">
          <DynamicTable<Product>
            title="Inactive Products"
            url="/products"
            buttonText="Add Product"
            addUrl="/admin/products/add"
            columns={columns}
            queryKey="inactiveProductsList"
          />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
};

export default ProductPage;
