export interface TokenPayload{
  sub: string;
  username: string;
  email: string;
  roles: string[];
  cartId: string;
  wishlistId: string;
}