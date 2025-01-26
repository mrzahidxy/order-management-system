"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/useStore";

type CartComponentProps = {
  productId: number;
};

const CartComponent: React.FC<CartComponentProps> = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const message = useCartStore((state) => state.message);
  const isLoading = useCartStore((state) => state.isLoading);



  const handleAddToCart = async () => {
    await addToCart(productId, quantity);
  };

  // Functions to handle quantity increase and decrease
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <Button
          className="text-2xl text-white bg-red-400 hover:bg-red-600 border-none"
          onClick={decreaseQuantity}
          type="button"
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="text-xl font-medium">{quantity}</span>
        <Button
          className="text-2xl bg-green-400 border-2 hover:bg-green-600 border-none"
          onClick={increaseQuantity}
          type="button"
        >
          +
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddToCart}
        >
          {isLoading ? "Loading..." : "Add to Cart"}
        </Button>
      </div>
      {message && <p className="text-green-600 font-medium">{message}</p>}
    </div>
  );
};

export default CartComponent;
