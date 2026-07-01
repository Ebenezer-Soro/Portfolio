"use client";

import { motion } from "framer-motion";

// Transition de page : fadeInUp 300ms à chaque changement de route.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
