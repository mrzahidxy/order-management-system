"use client";

import privateRequest from "@/healper/privateRequest";
import useCartStore from "@/store/useStore";
import CustomButton from "@/components/common/Button.component";
import CartList from "./Cart-list.component";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "@/components/common/PageLoader.component";

const CartPage = () => {
  const isLoading = useCartStore((state) => state.isLoading);
  const message = useCartStore((state) => state.message);
  const error = useCartStore((state) => state.error);
  const placeOrder = useCartStore((state) => state.placeOrder);

  const fetchCart = async () => {
    const response = await privateRequest.get("/carts");
    return response.data.data;
  };

  // Fetch data using react-query
  const {
    data: carts,
    isLoading: cartIsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchCart(),
  });

  if (cartIsLoading) {
    return <PageLoader isLoading={cartIsLoading} />;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  let totalPrice = 0;
  let totalDiscount = 0;

  // Function to calculate discount for a single product
  const calculateDiscount = (productPrice: number, productWeight: number, promotion: any, quantity: number) => {
    let discount = 0;

    if (promotion.type === "PERCENTAGE" && promotion.discount) {
      // Percentage discount
      discount = (productPrice * promotion.discount) / 100;
    } else if (promotion.type === "FIXED" && promotion.discount) {
      // Fixed discount
      discount = promotion.discount * quantity;
    } else if (promotion.type === "WEIGHTED" && promotion.slabs) {
      // Weight-based discount
      const slabs = JSON.parse(promotion.slabs);
      let discountPerUnit = 0;

      for (const slab of slabs) {
        if (
          productWeight >= slab.minWeight &&
          (slab.maxWeight === null || productWeight <= slab.maxWeight)
        ) {
          discountPerUnit = slab.discountPerUnit;
          break;
        }
      }

      discount = discountPerUnit * quantity;
    }

    return discount;
  };

  // Calculate total price and discounts
  for (const item of carts) {
    const productPrice = parseFloat(item.product.price) * item.quantity;
    const productWeight = item.product.weight * item.quantity;

    // Check if the product has promotions
    if (item.product.PromotionProduct && item.product.PromotionProduct.length > 0) {
      const firstPromotion = item.product.PromotionProduct[0].promotion;

      const discount = calculateDiscount(productPrice, productWeight, firstPromotion, item.quantity);
      totalDiscount += discount;
      totalPrice += productPrice - discount;
    } else {
      // No promotions, add the full price
      totalPrice += productPrice;
    }
  }

  const handleOrder = async () => {
    await placeOrder();
    refetch();
  };

  return (
    <div className="container grid grid-cols-3 gap-16">
      <CartList carts={carts} />

      <div className="space-y-12">
        <h4 className="text-xl">Order Summary</h4>
        <div className="grid grid-cols-2 space-y-2">
          <span>Sub-total</span> <span>{(totalPrice + totalDiscount).toFixed(2)}</span>
          <span>Shipping Charge</span> <span>0</span>
          <span>Discount</span> <span>{totalDiscount.toFixed(2)}</span>
          <span className="font-semibold text-xl">Total</span>{" "}
          <span className="font-semibold text-xl">{totalPrice.toFixed(2)}</span>
        </div>

        <div className="space-x-4 pt-4">
          <CustomButton
            onClick={handleOrder}
            loading={isLoading}
            title="Checkout Now"
            className="w-44 py-2"
          />
        </div>
        <p className="text-green-500">{message}</p>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
};

export default CartPage;
