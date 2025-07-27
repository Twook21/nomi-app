export interface AdminUserDetail {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  role: 'customer' | 'umkm_owner' | 'admin';
  createdAt: string;
  umkmOwner: {
    id: string;
    umkmName: string;
    isVerified: boolean;
  } | null;
  orders: {
    id: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
    umkmOwner: { umkmName: string };
  }[];
  stats: {
    totalSpending: number;
    totalOrders: number;
  };
}