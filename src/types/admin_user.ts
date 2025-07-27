export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'umkm_owner' | 'admin';
  createdAt: string;
}