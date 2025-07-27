export interface UmkmProfile {
  id: string;
  umkmName: string;
  umkmDescription: string;
  umkmAddress: string;
  umkmPhoneNumber: string;
  umkmEmail: string;
  bankAccountNumber: string | null;
  bankName: string | null;
  isVerified: boolean;
  user: {
    username: string;
    email: string;
  };
}