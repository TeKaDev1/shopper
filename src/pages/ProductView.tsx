
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductDetail from '@/components/ProductDetail';
import OrderForm from '@/components/OrderForm';
import { getProducts, Product } from '@/lib/data';
import { ChevronLeft, Home } from 'lucide-react';

const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = () => {
      setIsLoading(true);
      const products = getProducts();
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setIsLoading(false);
    };

    // Add a small delay to simulate loading
    const timer = setTimeout(fetchProduct, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleBuyClick = () => {
    setShowOrderForm(true);
  };

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm mb-8">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <Home size={14} className="ml-1" />
              <span>الرئيسية</span>
            </Link>
            <ChevronLeft size={14} className="mx-2 text-muted-foreground" />
            <Link to="/products" className="text-muted-foreground hover:text-foreground">
              المنتجات
            </Link>
            {product && (
              <>
                <ChevronLeft size={14} className="mx-2 text-muted-foreground" />
                <span className="font-medium truncate max-w-[200px]">{product.name}</span>
              </>
            )}
          </div>

          {/* Product Content */}
          {isLoading ? (
            <ProductSkeleton />
          ) : product ? (
            <ProductDetail product={product} onBuyClick={handleBuyClick} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
              <p className="text-muted-foreground mb-8">
                عذراً، لم يتم العثور على المنتج المطلوب
              </p>
              <Link 
                to="/products"
                className="px-4 py-2 bg-primary text-white rounded-lg inline-flex items-center hover:bg-primary/90 transition-colors"
              >
                <span>العودة إلى المنتجات</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && product && (
          <OrderForm 
            product={product}
            onClose={() => setShowOrderForm(false)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProductView;
