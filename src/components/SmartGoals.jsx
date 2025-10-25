import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AI } from '../utils/aiService';

const SmartGoals = ({ userData, onUpdateGoals }) => {
  const [bmr, setBMR] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [customGoals, setCustomGoals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    if (userData) {
      // Calculate BMR and daily caloric needs
      const calculatedBMR = AI.calculateBMR(
        userData.weight,
        userData.height,
        userData.age,
        userData.gender,
        userData.activityLevel
      );
      setBMR(calculatedBMR);

      // Generate meal plan recommendations
      const mealPlan = AI.generateMealPlan(calculatedBMR, userData.preferences);
      const dailyTotals = mealPlan.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setRecommendations(dailyTotals);
      setCustomGoals(dailyTotals);
    }
  }, [userData]);

  const handleGoalChange = (nutrient, value) => {
    setCustomGoals(prev => ({
      ...prev,
      [nutrient]: Number(value)
    }));
  };

  const handleSaveGoals = () => {
    onUpdateGoals(customGoals);
  };

  if (!bmr || !recommendations) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Smart Goal Setting</h2>

      {/* BMR and Daily Needs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Daily Energy Needs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Basal Metabolic Rate</h4>
            <p className="text-3xl font-bold text-primary">{bmr} calories</p>
            <p className="text-sm text-gray-600 mt-1">
              This is how many calories your body burns at rest
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Recommended Daily Intake</h4>
            <p className="text-3xl font-bold text-primary">{recommendations.calories} calories</p>
            <p className="text-sm text-gray-600 mt-1">
              Adjusted for your activity level and goals
            </p>
          </div>
        </div>
      </div>

      {/* Macro Goals */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Macro Nutrient Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['protein', 'carbs', 'fat'].map(nutrient => (
            <div key={nutrient} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {nutrient} (g)
              </label>
              <input
                type="number"
                value={customGoals[nutrient]}
                onChange={(e) => handleGoalChange(nutrient, e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
              <p className="text-xs text-gray-500">
                Recommended: {recommendations[nutrient]}g
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSaveGoals}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Save Custom Goals
      </motion.button>
    </motion.div>
  );
};

export default SmartGoals;