"use client";

import { Suspense } from "react";
import PromotionList from "./promotions-list";

// Define the columns for the DataTable
const PromotionPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromotionList />
    </Suspense>
  );
};

export default PromotionPage;
