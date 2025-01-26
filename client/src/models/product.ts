export type TProduct = {
  id: number;
  name: string;
  description: string;
  price: string; 
  tags: string;
  image: string;
  createdAt: string;
  updateAt: string;
};

export type TProductAPIResponse =  {
  collections: TProduct[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export type TCartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: TProduct;
};
