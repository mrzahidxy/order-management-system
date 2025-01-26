import { publicRequest } from "@/healper/privateRequest";
import { ProductCard } from "./Product-Card.component";
import { TProduct } from "@/models";

// Async function to fetch product data
const fetchProduct = async (): Promise<{ collections: TProduct[] } | null> => {
  try {
    const response = await publicRequest.get(`/products?limit=100?page=1&enabled=true`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return null;
  }
};

// Product Page Component
const Products = async () => {
  const productData = await fetchProduct();

  console.log("productData", productData);

  if (!productData || productData.collections.length === 0) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container space-y-16">
      <div className="w-full md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {productData.collections.map((product: TProduct) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            image={product.image ?? ""}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
