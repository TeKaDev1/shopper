
import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <footer className="bg-primary/5 py-6 text-center">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} - متجر ليبيا للتسوق</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
