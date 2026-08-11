export interface Service {
  id: string;
  name: string;
  price: number | string;
  isActive?: boolean;
}