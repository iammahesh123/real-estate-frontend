export const formatPrice = (price: number, listingType?: string): string => {
  if (price === null || price === undefined) return 'Price on Request';

  if (listingType === 'RENT') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price) + ' / mo';
  }

  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹ ${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹ ${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const buildWhatsAppLink = (
  whatsappNumber: string | undefined,
  propertyTitle: string,
  propertyCode: string,
  propertySlug: string
): string => {
  const number = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : '919876543210';
  const text = encodeURIComponent(
    `Hello! I am interested in "${propertyTitle}" (Property ID: ${propertyCode}). Please share more details and availability: ${window.location.origin}/properties/${propertySlug}`
  );
  return `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
};

export const getWhatsAppLink = (phone: string, text?: string): string => {
  const number = phone ? phone.replace(/[^0-9]/g, '') : '919876543210';
  const message = text ? encodeURIComponent(text) : encodeURIComponent('Hello! I would like to inquire regarding real estate services.');
  return `https://api.whatsapp.com/send?phone=${number}&text=${message}`;
};

