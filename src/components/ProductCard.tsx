
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden hover-glow bg-white"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        
        {product.videos && product.videos.length > 0 && (
          <div className="aspect-video overflow-hidden mt-2">
            <video controls className="w-full h-full">
              <source src={product.videos[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        <div className="p-4">
          <div className="text-xs font-medium text-primary/70 mb-2">
            {product.category}
          </div>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">
              {product.price.toFixed(2)} <span className="text-sm">د.ل</span>
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              عرض التفاصيل
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
