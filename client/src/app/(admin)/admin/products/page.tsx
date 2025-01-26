"use client";

import { Suspense } from "react";
import ProductList from "./product-list";

const ProductPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList />
    </Suspense>
  );
};
export default ProductPage;
