const TIER_MAP: Record<string, { ring: string; badge: string; label: string; emoji: string }> = {
  Bronze: { ring: 'ring-amber-300', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Bronze', emoji: '🥉' },
  Silver: { ring: 'ring-gray-300', badge: 'bg-gray-100 text-gray-600 border-gray-300', label: 'Silver', emoji: '🥈' },
  Gold: { ring: 'ring-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Gold', emoji: '🥇' },
  Platinum: { ring: 'ring-violet-400', badge: 'bg-violet-50 text-violet-700 border-violet-200', label: 'Platinum', emoji: '💎' },
};

export default TIER_MAP