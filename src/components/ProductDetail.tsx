
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';

interface ProductDetailProps {
  product: Product;
  onBuyClick: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBuyClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            {!showVideo ? (
              <motion.img
                key={currentImageIndex}
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <video 
                controls
                className="w-full h-full object-cover"
                src={product.videos && product.videos.length > 0 ? product.videos[currentVideoIndex] : ''}
              />
            )}
          </div>
          
          {/* Media Navigation */}
          {!showVideo ? (
            <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between">
              <button 
                onClick={prevImage}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all"
                aria-label="Previous Image"
              >
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={nextImage}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all"
                aria-label="Next Image"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center">
              <button 
                onClick={() => setShowVideo(false)}
                className="p-2 bg-primary text-white rounded-xl"
              >
                مشاهدة الصور
              </button>
            </div>
          )}

          {/* Switch to Videos or Images */}
          {product.videos && product.videos.length > 0 && (
            <div className="absolute inset-x-0 top-4 flex justify-center">
              <button 
                onClick={() => setShowVideo(!showVideo)}
                className="px-4 py-2 bg-primary text-white rounded-full"
              >
                {showVideo ? 'عرض الصور' : 'عرض الفيديو'}
              </button>
            </div>
          )}

          {/* Thumbnail Indicators */}
          <div className="absolute inset-x-0 bottom-16 flex justify-center gap-2">
            {!showVideo && product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
            {showVideo && product.videos && product.videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentVideoIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col">
          <motion.span 
            className="text-sm text-primary/70 mb-2"
            variants={itemVariants}
          >
            {product.category}
          </motion.span>
          
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-4"
            variants={itemVariants}
          >
            {product.name}
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground mb-6"
            variants={itemVariants}
          >
            {product.description}
          </motion.p>
          
          <motion.div 
            className="mt-auto"
            variants={itemVariants}
          >
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold">{product.price.toFixed(2)}</span>
              <span className="text-lg mr-1">د.ل</span>
            </div>
            
            <button
              onClick={onBuyClick}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="ml-2" size={20} />
              <span>شراء الآن</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
