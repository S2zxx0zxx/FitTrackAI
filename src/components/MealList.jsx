import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import decimal from '../utils/decimalMath';

const MealList = ({ meals = [], onDelete }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Meals</h2>
      {meals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            No meals added yet.
          </motion.div>
      ) : (
        <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {meals.map(m => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <motion.div 
                      className="font-medium"
                      layoutId={`name-${m.id}`}
                    >
                      {m.name}
                    </motion.div>
                    <motion.div 
                      className="text-sm text-textGray"
                      layoutId={`quantity-${m.id}`}
                    >
                      {m.quantity} serving(s)
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-right"
                    layoutId={`macros-${m.id}`}
                  >
                    <div className="text-sm">Protein: {decimal.round(Number(m.protein||0),1)} g</div>
                    <div className="text-sm">Carbs: {decimal.round(Number(m.carbs||0),1)} g</div>
                    <div className="text-sm">Fat: {decimal.round(Number(m.fat||0),1)} g</div>
                    <div className="text-sm font-medium">Cal: {Math.round(Number(m.calories||0))}</div>
                  </motion.div>
                  <motion.div 
                    className="ml-4"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button
                      aria-label={`Delete ${m.name}`}
                      onClick={() => onDelete(m.id)}
                      className="text-danger font-bold px-3 py-1 rounded-lg hover:bg-danger/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
        </div>
      )}
      </motion.div>
  );
};

export default React.memo(MealList);
