export interface DashboardStats {
  totalUsers: number;
  totalNFTs: number;
  totalCollections: number;
  activeAuctions: number;
  totalVolume: string;
  pendingKYC: number;
  activeExhibitions: number;
}

export interface Transaction {
  type: string;
  hash: string;
  amount: number;
  status: string;
}

export interface PendingActions {
  withdrawals: number;
  deposits: number;
  kyc: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  pendingActions: PendingActions;
}
