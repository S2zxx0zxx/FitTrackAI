import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import foodData from '../data/foodData.json';
import decimal from '../utils/decimalMath';

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

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (Number(quantity) <= 0 || isNaN(Number(quantity))) {
      setError('Quantity must be a positive number');
      return;
    }
    const q = Number(quantity);
    if (manualMode) {
      if (!manual.name) {
        setError('Please provide a name for the meal');
        return;
      }
      const p = Number(manual.protein) || 0;
      const c = Number(manual.carbs) || 0;
      const f = Number(manual.fat) || 0;
      const cal = Number(manual.calories) || 0;
      if (p < 0 || c < 0 || f < 0 || cal < 0) {
        setError('Nutrient values must be non-negative');
        return;
      }
      const meal = {
        name: manual.name,
        quantity: q,
        protein: decimal.round(decimal.mul(p, q), 1),
        carbs: decimal.round(decimal.mul(c, q), 1),
        fat: decimal.round(decimal.mul(f, q), 1),
        calories: Math.round(decimal.mul(cal, q))
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
        quantity: q,
        protein: decimal.round(decimal.mul(food.protein, q), 1),
        carbs: decimal.round(decimal.mul(food.carbs, q), 1),
        fat: decimal.round(decimal.mul(food.fat, q), 1),
        calories: Math.round(decimal.mul(food.calories, q)),
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
            <div className="space-y-3">
              <div>
                <label htmlFor="foodName" className="sr-only">Food Name</label>
                <input
                  id="foodName"
                  aria-label="Food name"
                  placeholder="Food name"
                  value={manual.name}
                  onChange={(e) => setManual(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="protein" className="sr-only">Protein (g)</label>
                <input
                  id="protein"
                  type="number"
                  aria-label="Protein"
                  placeholder="Protein (g)"
                  value={manual.protein}
                  onChange={(e) => setManual(prev => ({ ...prev, protein: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="calories" className="sr-only">Calories</label>
                <input
                  id="calories"
                  type="number"
                  aria-label="Calories"
                  placeholder="Calories"
                  value={manual.calories}
                  onChange={(e) => setManual(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
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

      {error && <div className="text-danger text-sm">{error}</div>}
      {showMacros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-4"
          >
            {Object.entries(calculateMacros() || {}).map(([key, value]) => (
              <div key={key} className="bg-white/5 rounded-xl p-3">
                <div className="text-sm opacity-70 capitalize">{key}</div>
                <div className="text-lg font-bold">{decimal.round(value, key==='calories'?0:1)}{key==='calories'? '': ' g'}</div>
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