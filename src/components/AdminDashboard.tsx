
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProducts, getOrders, Product, Order, saveProduct, deleteProduct, updateOrderStatus } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart, 
  ShoppingBag, 
  Package, 
  LogOut, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  Users,
  DollarSign
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  // Load products and orders
  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const handleOrderStatusChange = (orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered') => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
    toast({
      title: "تم تحديث حالة الطلب",
      description: `تم تحديث الحالة إلى ${
        status === 'pending' ? 'معلق' : 
        status === 'processing' ? 'قيد المعالجة' :
        status === 'shipped' ? 'تم الشحن' : 'تم التسليم'
      }`,
    });
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for overview
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  // Product Form
  const ProductForm = ({ product, onClose }: { product: Product | null, onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        name: '',
        description: '',
        price: 0,
        images: ['', '', ''],
        category: ''
      }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (index: number, value: string) => {
      const updatedImages = [...(formData.images || [])];
      updatedImages[index] = value;
      setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name || !formData.price || !formData.images?.[0]) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      // Save product
      saveProduct(formData as Product);
      
      // Refresh products list
      setProducts(getProducts());
      
      // Show success message
      toast({
        title: product ? "تم تحديث المنتج" : "تم إضافة المنتج",
        description: product ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
      });
      
      // Close modal
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">اسم المنتج</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">الفئة</label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="أدخل اسم الفئة الجديدة"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">الوصف</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">السعر (د.ل)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">روابط الصور (على الأقل صورة واحدة)</label>
                <div className="space-y-2">
                  {[0, 1, 2].map((index) => (
                    <input
                      key={index}
                      type="url"
                      required={index === 0}
                      placeholder={index === 0 ? "رابط الصورة الرئيسية (مطلوب)" : `رابط الصورة ${index + 1} (اختياري)`}
                      value={formData.images?.[index] || ''}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {product ? 'تحديث المنتج' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(productId);
      setProducts(getProducts());
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="md:w-64 bg-white shadow-sm p-4 md:p-6">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-xl font-bold">لوحة الإدارة</h1>
          </div>
          
          <nav className="flex-grow">
            <ul className="space-y-1">
              <li>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <BarChart size={18} className="ml-2" />
                  <span>نظرة عامة</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === 'products' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('products')}
                >
                  <Package size={18} className="ml-2" />
                  <span>المنتجات</span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingBag size={18} className="ml-2" />
                  <span>الطلبات</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="pt-4 border-t">
            <button
              className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={18} className="ml-2" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">نظرة عامة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-500 ml-4">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">إجمالي المنتجات</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-50 text-green-500 ml-4">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">إجمالي المبيعات</p>
                      <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} د.ل</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-50 text-amber-500 ml-4">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">الطلبات المعلقة</p>
                      <p className="text-2xl font-bold">{pendingOrders}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">أحدث الطلبات</h3>
                
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">رقم الطلب</th>
                          <th className="text-right py-3 px-4">العميل</th>
                          <th className="text-right py-3 px-4">الحالة</th>
                          <th className="text-right py-3 px-4">المبلغ</th>
                          <th className="text-right py-3 px-4">التاريخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.customerName}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status === 'pending' ? 'معلق' : 
                                order.status === 'processing' ? 'قيد المعالجة' :
                                order.status === 'shipped' ? 'تم الشحن' : 'تم التسليم'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{order.totalPrice.toFixed(2)} د.ل</td>
                            <td className="py-3 px-4">{order.date}</td>
                            <td className="py-3 px-4">
                              <select
                                title="تحديث حالة الطلب"
                                value={order.status}
                                onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                                className="border border-gray-200 rounded-lg px-2 py-1"
                              >
                                <option value="pending">معلق</option>
                                <option value="processing">قيد المعالجة</option>
                                <option value="shipped">تم الشحن</option>
                                <option value="delivered">تم التسليم</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">لا توجد طلبات حالياً</p>
                )}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">المنتجات</h2>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-primary/90 transition-colors"
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Plus size={18} className="ml-2" />
                  <span>إضافة منتج</span>
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <div className="relative">
                    <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث عن منتج..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">المنتج</th>
                          <th className="text-right py-3 px-4">الفئة</th>
                          <th className="text-right py-3 px-4">السعر</th>
                          <th className="text-right py-3 px-4">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded ml-3"
                                />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">{product.price.toFixed(2)} د.ل</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2 space-x-reverse">
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsEditModalOpen(true);
                                  }}
                                  aria-label="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  aria-label="Delete"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد منتجات حالياً'}
                  </p>
                )}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">الطلبات</h2>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4">رقم الطلب</th>
                          <th className="text-right py-3 px-4">العميل</th>
                          <th className="text-right py-3 px-4">المدينة</th>
                          <th className="text-right py-3 px-4">رقم الهاتف</th>
                          <th className="text-right py-3 px-4">المبلغ</th>
                          <th className="text-right py-3 px-4">الحالة</th>
                          <th className="text-right py-3 px-4">التاريخ</th>
                          <th className="text-right py-3 px-4">تحديث الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.customerName}</td>
                            <td className="py-3 px-4">{order.city}</td>
                            <td className="py-3 px-4">{order.phone}</td>
                            <td className="py-3 px-4">{order.totalPrice.toFixed(2)} د.ل</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status === 'pending' ? 'معلق' : 
                                order.status === 'processing' ? 'قيد المعالجة' :
                                order.status === 'shipped' ? 'تم الشحن' : 'تم التسليم'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">لا توجد طلبات حالياً</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <ProductForm 
            product={selectedProduct} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
