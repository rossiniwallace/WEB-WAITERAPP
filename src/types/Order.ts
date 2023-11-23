export interface OrderProps {
  id: string;
  table: string;
  status: 'WAITING'| 'IN_PRODUCTION' | 'DONE';
  products: {
    id: string;
    quantity: number;
    product: {
      name: string;
      imagePath: string;
      price: number;
    };
  }[];
}
