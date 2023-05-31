export type Sale = {
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  services: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  total: number;
  createdAt?: string;
};
