import { PaymentStatus_Z } from '@prisma/client';

export interface IPaymentItem {
  bookId: string;
  quantity: number;
  price: number;
  title: string;
  language: string;
}

export interface IPaymentRequest {
  id?: string;
  dates: Date[];
  items: IPaymentItem[];
  totalAmount: number;
  paymentImageUrl?: string;
  status?: PaymentStatus_Z;
  notes?: string;
  createdAt?: Date;
}

export interface IDailySales {
  id: string;
  bookId: string;
  book: {
    id: string;
    name: string;
    language: string;
    price: number;
    category: string;
  };
  quantity: number;
  date: Date;
}