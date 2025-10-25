import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="fixed bottom-0 w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm py-2 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center text-sm text-gray-400/70"
        whileHover={{ 
          opacity: 1,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        Developed by Satzzxzxx 💚
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
