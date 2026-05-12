export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "OVERDUE";

export interface PaymentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  month: string;
  status: PaymentStatus;
  proofUrl?: string;
  dueDate: string;
  createdAt: string;
  user?: PaymentUser;
}