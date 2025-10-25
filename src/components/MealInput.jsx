import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { fetchNutritionData, parseWeightInput, convertWeight } from '../utils/nutritionUtils';
import decimal from '../utils/decimalMath';

const MealInput = ({ onAddMeal }) => {
  const [foodName, setFoodName] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState('');

  const handleWeightChange = (input) => {
    setWeight(input);
    try {
      parseWeightInput(input);
      setError('');
    } catch (err) {
      setError('Please enter weight in format: 100g or 0.1kg');
    }
  };

  const clearForm = () => {
    setFoodName('');
    setWeight('');
    setNutritionData(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!foodName.trim()) {
      setError('Please enter a food name');
      return;
    }

    try {
      const { value, unit } = parseWeightInput(weight);
      const weightInGrams = convertWeight(value, unit, 'g');
      
      setLoading(true);
      const nutrition = await fetchNutritionData(foodName, weightInGrams);
      setNutritionData(nutrition);

      if (onAddMeal) {
        onAddMeal({
          name: nutrition.name,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          weight: weightInGrams,
          unit: 'g'
        });
        clearForm();
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch nutrition data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name (e.g., Rice, Apple)"
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading}
          />
        </div>

        <div>
          <input
            type="text"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="Enter weight (e.g., 100g, 0.1kg)"
            className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-700'}`}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Add Meal'}
        </motion.button>

        {nutritionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-gray-700/30 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Calories</p>
                <p className="text-lg font-medium">{nutritionData.calories} kcal</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Protein</p>
                <p className="text-lg font-medium">{nutritionData.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Carbs</p>
                <p className="text-lg font-medium">{nutritionData.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fat</p>
                <p className="text-lg font-medium">{nutritionData.fat}g</p>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default MealInput;