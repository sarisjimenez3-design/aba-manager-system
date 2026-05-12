export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}