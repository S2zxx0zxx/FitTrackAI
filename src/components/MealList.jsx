import React from 'react';
import decimal from '../utils/decimalMath';

const MealList = ({ meals = [], onDelete }) => {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Meals</h2>
      {meals.length === 0 ? (
        <div className="opacity-70">No meals added yet.</div>
      ) : (
        <div className="space-y-3">
          {meals.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm opacity-70">{m.quantity} serving(s)</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Protein: {decimal.round(Number(m.protein||0),1)} g</div>
                <div className="text-sm">Carbs: {decimal.round(Number(m.carbs||0),1)} g</div>
                <div className="text-sm">Fat: {decimal.round(Number(m.fat||0),1)} g</div>
                <div className="text-sm">Cal: {Math.round(Number(m.calories||0))}</div>
              </div>
              <div className="ml-4">
                <button aria-label={`Delete ${m.name}`} onClick={() => onDelete(m.id)} className="text-danger font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;
