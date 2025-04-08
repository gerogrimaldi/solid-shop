export interface CartItem {
  itemId: string;
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface WishlistItem {
  itemId: string;
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}