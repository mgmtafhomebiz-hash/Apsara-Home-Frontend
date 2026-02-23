export type MemberStatus = 'active' | 'pending' | 'blocked' | 'kyc_review';

export type MemberTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Member {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  status: MemberStatus;
  tier: MemberTier;
  orders: number;
  totalSpent: number;
  earnings: number;
  referrals: number;
  joinedAt: string;
  lastActiveAt: string;
}