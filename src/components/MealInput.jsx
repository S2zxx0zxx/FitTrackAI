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

  // Manual mode fields (tests rely on these placeholders)
  const [manualMode, setManualMode] = useState(false);
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualQuantity, setManualQuantity] = useState(1);

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

    if (manualMode) {
      if (!foodName.trim()) {
        setError('Please enter a food name');
        return;
      }

      const protein = Number(manualProtein || 0);
      const calories = Number(manualCalories || 0);
      const carbs = Number(manualCarbs || 0);
      const fat = Number(manualFat || 0);
      const quantity = Number(manualQuantity || 1);

      if (protein <= 0 || calories <= 0) {
        setError('Please provide valid nutrition values');
        return;
      }

      if (onAddMeal) {
        onAddMeal({
          name: foodName.trim(),
          quantity: quantity,
          protein: protein,
          carbs: carbs || 0,
          fat: fat || 0,
          calories: calories
        });
        clearForm();
        setManualProtein('');
        setManualCarbs('');
        setManualFat('');
        setManualCalories('');
        setManualQuantity(1);
      }

      return;
    }

    // Automatic mode: requires food name and weight
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
        <div className="flex items-center space-x-2">
          <input
            id="manual-mode"
            type="checkbox"
            checked={manualMode}
            onChange={(e) => setManualMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="manual-mode" className="text-sm text-gray-300">Manual mode</label>
        </div>

        <div>
          {!manualMode ? (
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter food name (e.g., Rice, Apple)"
              className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled={loading}
            />
          ) : (
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Food name"
              className="w-full px-4 py-2 bg-gray-700/50 rounded-lg"
            />
          )}
        </div>

        <div>
          {!manualMode ? (
            <input
              type="text"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="Enter weight (e.g., 100g, 0.1kg)"
              className="w-full px-4 py-2 bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled={loading}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Protein (g)"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                className="px-3 py-2 rounded bg-gray-700/50"
              />
              <input
                placeholder="Calories"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="px-3 py-2 rounded bg-gray-700/50"
              />
              <input
                placeholder="Carbs (g)"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                className="px-3 py-2 rounded bg-gray-700/50"
              />
              <input
                placeholder="Fat (g)"
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                className="px-3 py-2 rounded bg-gray-700/50"
              />
            </div>
          )}
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