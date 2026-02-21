const getPasswordStrength = (pw: string) => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-400', pct: '25%' };
  if (score === 2) return { label: 'Fair', color: 'bg-amber-400', pct: '50%' };
  if (score === 3) return { label: 'Good', color: 'bg-blue-400', pct: '75%' };
  return { label: 'Strong', color: 'bg-emerald-500', pct: '100%' };
};

export default getPasswordStrength