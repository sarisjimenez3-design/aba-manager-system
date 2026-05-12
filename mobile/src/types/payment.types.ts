export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "OVERDUE";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  month: string;
  status: PaymentStatus;
  proofUrl?: string;
  dueDate: string;
  createdAt: string;
}