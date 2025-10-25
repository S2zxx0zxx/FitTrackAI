import { motion } from 'framer-motion';
import { useState } from 'react';
import foodData from '../data/foodData.json';

const MealInput = ({ onAddMeal }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMacros, setShowMacros] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const food = foodData.find(f => f.name === selectedFood);
    if (food) {
      const meal = {
        ...food,
        quantity,
        protein: food.protein * quantity,
        carbs: food.carbs * quantity,
        fat: food.fat * quantity,
        calories: food.calories * quantity,
      };
      onAddMeal(meal);
      setSelectedFood('');
      setQuantity(1);
      setShowMacros(false);
    }
  };

  const calculateMacros = () => {
    const food = foodData.find(f => f.name === selectedFood);
    if (food) {
      return {
        protein: food.protein * quantity,
        carbs: food.carbs * quantity,
        fat: food.fat * quantity,
        calories: food.calories * quantity,
      };
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-bold mb-6">Add Meal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select
            value={selectedFood}
            onChange={(e) => {
              setSelectedFood(e.target.value);
              setShowMacros(!!e.target.value);
            }}
            className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Food</option>
            {foodData.map(food => (
              <option key={food.name} value={food.name}>{food.name}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
            placeholder="Quantity"
          />
        </div>

        {showMacros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-4"
          >
            {Object.entries(calculateMacros() || {}).map(([key, value]) => (
              <div key={key} className="bg-white/5 rounded-xl p-3">
                <div className="text-sm opacity-70 capitalize">{key}</div>
                <div className="text-lg font-bold">{Math.round(value * 10) / 10}</div>
              </div>
            ))}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!selectedFood}
          className="w-full bg-primary text-black font-bold py-3 px-6 rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-primary/90 transition-colors"
        >
          Add Meal
        </button>
      </form>
    </motion.div>
  );
};

export default MealInput;