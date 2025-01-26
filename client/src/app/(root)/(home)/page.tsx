import Products from "@/components/common/Products.component";
import { MainBanner } from "./MainBanner.component";

const HomePage = () => {
  return (
    <div className="container space-y-16 relative">
      <MainBanner />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">All Products</h3>
        <Products />
      </div>
    </div>
  );
};

export default HomePage;
