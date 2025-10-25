import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import foodData from '../data/foodData.json';

const fuzzyMatch = (query) => {
  if (!query) return [];
  const q = query.toLowerCase();
  return foodData.filter(f => f.name.toLowerCase().includes(q));
};

const MealInput = ({ onAddMeal }) => {
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMacros, setShowMacros] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manual, setManual] = useState({ name: '', protein: '', carbs: '', fat: '', calories: '' });
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (manualMode) {
      if (!manual.name) return;
      const meal = {
        name: manual.name,
        quantity: Number(quantity) || 1,
        protein: (Number(manual.protein) || 0) * (Number(quantity) || 1),
        carbs: (Number(manual.carbs) || 0) * (Number(quantity) || 1),
        fat: (Number(manual.fat) || 0) * (Number(quantity) || 1),
        calories: (Number(manual.calories) || 0) * (Number(quantity) || 1)
      };
      onAddMeal(meal);
      setManual({ name: '', protein: '', carbs: '', fat: '', calories: '' });
      setQuantity(1);
      return;
    }
    const food = foodData.find(f => f.name === selectedFood);
    if (food) {
      const meal = {
        name: food.name,
        quantity,
        protein: Number((food.protein * quantity).toFixed(1)),
        carbs: Number((food.carbs * quantity).toFixed(1)),
        fat: Number((food.fat * quantity).toFixed(1)),
        calories: Math.round(food.calories * quantity),
      };
      onAddMeal(meal);
      setSelectedFood('');
      setQuantity(1);
      setShowMacros(false);
    }
  };

  const calculateMacros = () => {
    if (manualMode) {
      return {
        protein: (Number(manual.protein) || 0) * (Number(quantity) || 1),
        carbs: (Number(manual.carbs) || 0) * (Number(quantity) || 1),
        fat: (Number(manual.fat) || 0) * (Number(quantity) || 1),
        calories: (Number(manual.calories) || 0) * (Number(quantity) || 1),
      };
    }
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

  useEffect(() => {
    setSuggestions(fuzzyMatch(selectedFood));
  }, [selectedFood]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-bold mb-6">Add Meal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={manualMode} onChange={() => setManualMode(!manualMode)} />
              <span className="text-sm opacity-70">Manual entry</span>
            </label>
          </div>
          {manualMode ? (
            <input
              aria-label="Manual food name"
              placeholder="Food name"
              value={manual.name}
              onChange={(e) => setManual(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <>
              <input
                aria-label="Search food"
                placeholder="Search food (fuzzy)"
                value={selectedFood}
                onChange={(e) => { setSelectedFood(e.target.value); setShowMacros(!!e.target.value); }}
                className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
              />
              {suggestions.length > 0 && selectedFood && (
                <div className="mt-2 bg-white/5 rounded-xl p-2 max-h-40 overflow-auto">
                  {suggestions.slice(0,6).map(s => (
                    <div key={s.name} className="py-1 cursor-pointer hover:bg-white/10 rounded px-2" onClick={() => { setSelectedFood(s.name); setShowMacros(true); }}>{s.name}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <input
            type="number"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0.1"
            className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
            placeholder="Quantity (servings)"
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
          disabled={manualMode ? !manual.name : !selectedFood}
          className="w-full bg-primary text-black font-bold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Add Meal
        </button>
      </form>
    </motion.div>
  );
};

export default MealInput;