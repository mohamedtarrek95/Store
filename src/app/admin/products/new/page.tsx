'use client';

import { motion } from 'framer-motion';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product for your store</p>
      </div>
      <ProductForm />
    </motion.div>
  );
}
