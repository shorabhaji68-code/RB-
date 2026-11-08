// Helper to format currency in Bengali Taka (টাকা)
export const formatTaka = (amount: number, showBengaliDigits: boolean = true): string => {
  const rounded = Math.round(amount);
  
  if (showBengaliDigits) {
    try {
      // Bengali digits and comma separation (e.g. ৳ ৪,৫০০ টাকা)
      const formatted = rounded.toLocaleString('bn-BD');
      return `৳ ${formatted} টাকা`;
    } catch (e) {
      // Fallback
      return `৳ ${toBengaliDigits(rounded.toLocaleString())} টাকা`;
    }
  }

  return `৳ ${rounded.toLocaleString()} টাকা`;
};

export const toBengaliDigits = (str: string | number): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const formatPriceUnit = (unit: string): string => {
  switch (unit) {
    case 'per sq.ft':
    case 'প্রতি স্কয়ার ফিট':
    case 'প্রতি বর্গফুট':
      return 'প্রতি বর্গফুট (sq.ft)';
    case 'per piece':
    case 'প্রতি পিস':
      return 'প্রতি পিস (piece)';
    case 'per sheet':
    case 'প্রতি শিট':
      return 'প্রতি শিট (sheet)';
    default:
      return unit;
  }
};
