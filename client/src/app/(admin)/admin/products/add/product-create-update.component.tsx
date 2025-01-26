"use client";

import { Formik } from "formik";
import { ProductForm } from "./product-form.component";
import { InitialValue, ProductCreate, ProductSchema } from "./form.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const ProductCreateUpdate = ({ id }: any) => {
  const router = useRouter();

  const fetchData = async (id: string) => {
    const response = await privateRequest.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`
    );
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["productsList", id],
    queryFn: () => fetchData(id),
    enabled: !!id,
  });

  // Display loading state
  if (isLoading) return <div>Loading...</div>;

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const handleSubmit = async (values: ProductCreate) => {

    console.log("values", values);
    const response = id
      ? await privateRequest.put(`/products/${id}`, values)
      : await privateRequest.post("/products", values);
    if (response) {
      router.push("/admin/products");
    }
  };

  return (
    <Card className="w-1/2">
      <Link href="/admin/products" className="p-2">Back</Link>
      <CardHeader>
        <CardTitle>{id ? "Update Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={
            id
              ? {
                  ...data?.data,
                  tags: data?.data?.tags?.split(",")
                }
              : InitialValue
          }
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          <ProductForm />
        </Formik>
      </CardContent>
    </Card>
  );
};
