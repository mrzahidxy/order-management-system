"use client";

import { Formik } from "formik";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import { Promotion, PromotionInitialValue, PromotionSchema } from "./form.config";
import PromotionForm from "./promotion-form.component";
import Link from "next/link";

export const PromotionCreateUpdate = ({ id }: { id?: string }) => {
  const router = useRouter();

  const fetchData = async (id: string) => {
    const response = await privateRequest.get(`/promotions/${id}`);
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["promotionData", id],
    queryFn: () => fetchData(id!),
    enabled: !!id,
  });

  // Display loading state
  if (isLoading) return <div>Loading...</div>;

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const handleSubmit = async (values: Promotion) => {
    try {
      const response = id
        ? await privateRequest.put(`/promotions/${id}`, values)
        : await privateRequest.post("/promotions", values);

      if (response) {
        router.push("/admin/promotions");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  return (
    <Card className="w-1/2">
      <Link href="/admin/promotions" className="p-2 font-medium">Back</Link>
      <CardHeader>
        <CardTitle>{id ? "Update Promotion" : "Add New Promotion"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={
            id && data?.data
              ? {
                  ...data.data,
                  startDate: new Date(data.data.startDate).toISOString().split("T")[0],
                  endDate: new Date(data.data.endDate).toISOString().split("T")[0],
                  slabs: data.data.slabs ? JSON.parse(data.data.slabs) : [],
                  productIds: data.data.products?.map((p: { productId: string }) => p.productId) || [],
                }
              : PromotionInitialValue
          }
          validationSchema={PromotionSchema}
          onSubmit={handleSubmit}
        >
          <PromotionForm id={id} />
        </Formik>
      </CardContent>
    </Card>
  );
};
