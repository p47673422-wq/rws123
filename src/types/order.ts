export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PACKED' | 'COLLECTED';

export interface OrderItem {
  bookId: string;
  language: string;
  quantity: number;
  title?: string; // for display
}

export interface Order {
  id: string;
  distributorId: string;
  storeOwnerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  otp?: string; // present when status is PACKED
  // Relations (populated on fetch)
  distributor?: {
    name: string;
    phone: string;
    email: string;
    captainId: string;
  };
  captain?: {
    name: string;
  };
}