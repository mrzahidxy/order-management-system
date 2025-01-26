"use client";

import { DataTable } from "@/components/ui/data-table.component";
import privateRequest from "@/healper/privateRequest";
import { ColumnDef } from "@tanstack/react-table";
import AddressModal from "./Adddress.component";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import DefaultLoader from "@/components/common/DefaultLoacer.component";
import Address from "./Adddress.component";

type Props = {};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "netAmount",
    header: "Amount",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const Profile = (props: Props) => {
  const session = useSession();

  const fetchUserInfo = async () => {
    const response = await privateRequest.get("/auth/me");
    return response.data.data;
  };

  const {
    data: userInfo,
    isLoading: userInfoLoading,
    refetch,
  } = useQuery({ queryKey: ["user"], queryFn: fetchUserInfo });

  const fetchOrders = async () => {
    const response = await privateRequest.get(
      `/orders/users/me`
    );
    return response.data.data.collection;
  };

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchOrders,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {userInfoLoading ? (
          <DefaultLoader />
        ) : (
          <div className="md:col-span-1 shadow p-6 ">
            <div className="bg-white  rounded-lg space-y-4">
              <h2 className="text-2xl font-bold">User Information</h2>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Name:</span>{" "}
                <span>{userInfo?.name}</span>
                <span className="font-semibold">Email:</span>{" "}
                <span>{userInfo?.email}</span>
                <span className="font-semibold">Address:</span>{" "}
              </div>
              <Address user={userInfo} onRefresh={refetch} />
            </div>
          </div>
        )}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          {ordersLoading ? (
            <DefaultLoader />
          ) : (
            <DataTable columns={columns} data={orders ?? []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
