import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Footer = () => {
  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المنتجات', path: '/products' },
    { name: 'لوحة الإدارة', path: '/admin' }
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
            <ul className="text-sm space-y-1">
              <li>الهاتف: 0922078595</li>
              <li>البريد الإلكتروني: info@libya-shopper.com</li>
              <li>العنوان: طرابلس، ليبيا</li>
            </ul>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">تصفح الموقع</h3>
            <nav className="flex flex-col space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm hover:text-primary transition-all",
                    window.location.pathname === link.path ? "font-bold text-primary" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;