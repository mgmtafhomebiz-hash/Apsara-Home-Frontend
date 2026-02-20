const formatPrice = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });