const formatPrice = (n: number): string =>
  '\u20B1' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default formatPrice;
