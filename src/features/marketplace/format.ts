export const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const tierLabel: Record<string, string> = {
  luxury: 'Luxury',
  premium: 'Premium',
  affordable: 'Affordable',
  commercial: 'Commercial',
  student: 'Student',
};
