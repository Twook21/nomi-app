export interface AdminUmkmProfile {
  id: string;
  umkmName: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
  umkmAddress: string | null;
  totalTurnover: number;
  averageRating: number;
}