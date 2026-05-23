export interface DashboardChartItem {
  label: string;
  value: number;
}

export interface LatestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalAthletes: number;
  totalParents: number;
  totalCoaches: number;
  totalAdmins: number;

  pendingPayments: number;
  overduePayments: number;
  approvedPayments: number;
  rejectedPayments: number;

  totalApprovedAmount: number;
  monthlyIncome: number;
  approvedToday: number;
  approvedTodayAmount: number;

  paymentStatusChart: DashboardChartItem[];
  userRoleChart: DashboardChartItem[];

  latestUsers: LatestUser[];
}