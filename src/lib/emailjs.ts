
import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'itzhapy@gmail.com';
const TEMPLATE_ID = 'template_f5rh7n9';
const PUBLIC_KEY = 'B6EzNeSIjQOTyWOLO';

interface OrderEmailData {
  customerName: string;
  city: string;
  address: string;
  phone: string;
  productDetails: string;
  totalPrice: number;
  notes?: string;  // Added notes field
}

export const sendOrderEmail = async (data: OrderEmailData): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: 'Libya Shopper',
        product_name: data.productDetails,
        product_price: data.totalPrice.toFixed(2),
        customer_name: data.customerName,
        customer_phone: data.phone,
        customer_address: `${data.city}, ${data.address}`,
        notes: data.notes || '',  // Pass notes to template
        reply_to: 'support@libya-shopper.com'
      },
      PUBLIC_KEY
    );

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const generateWhatsAppLink = (
  phone: string,
  orderData: OrderEmailData
): string => {
  // Format WhatsApp message
  const message = `
*طلب جديد من متجر ليبيا للتسوق*
------------------
*الاسم:* ${orderData.customerName}
*المدينة:* ${orderData.city}
*العنوان:* ${orderData.address}
*الهاتف:* ${orderData.phone}
------------------
*المنتجات:*
${orderData.productDetails}
------------------
*إجمالي المبلغ:* ${orderData.totalPrice.toFixed(2)} دينار ليبي
${orderData.notes ? `\n*ملاحظات:* ${orderData.notes}` : ''}
`;

  // Create WhatsApp URL with admin phone number (remove any + or leading zeros)
  const formattedPhone = '+218924944337';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};
