
import React, { useState } from 'react';
import { Product, saveOrder } from '@/lib/data';
import { sendOrderEmail } from '@/lib/emailjs';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    city: '',
    address: '',
    phone: '',
    notes: '', // New notes field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order data
      const orderData = {
        customerName: formData.customerName,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes, // Include notes in order data
        products: [{ productId: product.id, quantity: 1 }],
        totalPrice: product.price
      };

      // Prepare email data
      const emailData = {
        customerName: formData.customerName,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        productDetails: `${product.name} - ${product.price.toFixed(2)} د.ل`,
        totalPrice: product.price,
        notes: formData.notes // Include notes in email data
      };

      // Save order to local storage
      saveOrder(orderData);

      // Send email notification
      await sendOrderEmail(emailData);

      // Show success message
      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سيتم التواصل معك قريبًا لتأكيد الطلب.",
      });

      // Close form
      onClose();

      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "حدث خطأ!",
        description: "لم يتم إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">إكمال الطلب</h2>

          <div className="flex items-center p-3 mb-4 bg-primary/5 rounded-lg">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-12 h-12 object-cover rounded-md ml-3" 
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-primary font-bold">{product.price.toFixed(2)} د.ل</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">الاسم</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">المدينة</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">العنوان</label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="مثال: 0912345678"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">ملاحظات</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                disabled={loading}
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
