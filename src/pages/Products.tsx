
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/data';
import { Search, Filter } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = ['الكل', ...new Set(products.map(product => product.category))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || selectedCategory === 'الكل' || 
                           product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'الكل' ? null : category);
  };

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="pt-20">
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">المنتجات</h1>
            <p className="text-muted-foreground">
              تصفح مجموعتنا من المنتجات عالية الجودة
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <div className="relative inline-block w-full md:w-auto">
                <select
                  value={selectedCategory || 'الكل'}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-200 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                  <Filter size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array(8).fill(0).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : filteredProducts.length > 0 ? (
              // Products list
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            ) : (
              // No products found
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <p className="text-lg text-muted-foreground">
                  لا توجد منتجات مطابقة للبحث
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
