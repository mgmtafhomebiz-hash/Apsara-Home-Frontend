const formatDate = (d: string): string => {
  const date = new Date(d);

  if (Number.isNaN(date.getTime())) {
    return d;
  }

  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default formatDate;
