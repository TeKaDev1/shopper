
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  videos?: string[]; // Optional array of video URLs
}

export interface Order {
  id: string;
  customerName: string;
  city: string;
  address: string;
  phone: string;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  notes?: string; // Add this line
}

// Sample product data
export const products: Product[] = [
  {
    id: '1',
    name: 'هاتف ذكي متطور',
    description: 'هاتف ذكي بمواصفات عالية، شاشة سوبر أموليد، كاميرا احترافية، وبطارية طويلة العمر.',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2235&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=2036&auto=format&fit=crop'
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '2',
    name: 'ساعة ذكية فاخرة',
    description: 'ساعة ذكية بتصميم أنيق، مقاومة للماء، تتبع النشاط البدني، وعمر بطارية يصل إلى 7 أيام.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=2127&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '3',
    name: 'سماعات لاسلكية',
    description: 'سماعات لاسلكية مع إلغاء الضوضاء النشط، صوت عالي الجودة، ومدة تشغيل طويلة.',
    price: 159.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481207801830-97f0f9a1337e?q=80&w=2070&auto=format&fit=crop'
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/headphones_demo.mp4'
    ],
    category: 'إلكترونيات'
  },
  {
    id: '4',
    name: 'حقيبة جلدية أنيقة',
    description: 'حقيبة جلدية فاخرة، مصنوعة يدويًا من أجود أنواع الجلود، مناسبة للاستخدام اليومي أو العمل.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop'
    ],
    category: 'أزياء'
  },
  {
    id: '5',
    name: 'نظارة شمسية كلاسيكية',
    description: 'نظارة شمسية بتصميم كلاسيكي، عدسات مضادة للأشعة فوق البنفسجية، وإطار متين.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615812214208-4d7399e9a016?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'أزياء'
  },
  {
    id: '6',
    name: 'عطر فاخر للرجال',
    description: 'عطر فاخر للرجال برائحة خشبية مميزة تدوم طويلًا، مناسب للمناسبات الخاصة واليومية.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1590736969596-dd610b3207a9?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'عطور'
  },
];

// Sample orders data
export const orders: Order[] = [
  {
    id: '1',
    customerName: 'أحمد محمد',
    city: 'طرابلس',
    address: 'شارع النصر، حي الأندلس',
    phone: '0912345678',
    products: [{ productId: '1', quantity: 1 }, { productId: '3', quantity: 2 }],
    totalPrice: 1619.97,
    status: 'delivered',
    date: '2023-05-15'
  },
  {
    id: '2',
    customerName: 'فاطمة علي',
    city: 'بنغازي',
    address: 'شارع عمر المختار، وسط المدينة',
    phone: '0923456789',
    products: [{ productId: '2', quantity: 1 }],
    totalPrice: 299.99,
    status: 'processing',
    date: '2023-05-20'
  },
];

// Sample admin user
export const adminUser = {
  username: 'dkhil',
  password: 'Mo090909' // In a real app, use a secure hashing method
};

// Local storage helpers
export const saveProduct = (product: Product) => {
  const currentProducts = JSON.parse(localStorage.getItem('products') || JSON.stringify(products));
  if (product.id) {
    // Update existing product
    const updatedProducts = currentProducts.map((p: Product) => 
      p.id === product.id ? product : p
    );
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  } else {
    // Add new product
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    localStorage.setItem('products', JSON.stringify([...currentProducts, newProduct]));
  }
};

export const deleteProduct = (productId: string) => {
  const currentProducts = JSON.parse(localStorage.getItem('products') || JSON.stringify(products));
  const updatedProducts = currentProducts.filter((p: Product) => p.id !== productId);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem('products') || JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem('orders') || JSON.stringify(orders));
};

export const saveOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
  const currentOrders = getOrders();
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as const
  };
  localStorage.setItem('orders', JSON.stringify([...currentOrders, newOrder]));
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const currentOrders = getOrders();
  const updatedOrders = currentOrders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  return updatedOrders.find(order => order.id === orderId);
};

// Initialize local storage with sample data
export const initializeData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};
