export interface OrderDto {

  id: number;

  customerId: number;

  partnerId: number;

  orderStatus: string;

  itemId: number;

  createdTime: string;

  // UI-only fields
  itemName?: string;
  imageUrl?: string;
  price?: number;
  partnerPhone?: string;
}