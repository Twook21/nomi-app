export interface AdminOrder {
  id: string;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customer: {
    username: string;
  };
  umkmOwner: {
    umkmName: string;
  };
}