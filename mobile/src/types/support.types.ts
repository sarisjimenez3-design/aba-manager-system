export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
}