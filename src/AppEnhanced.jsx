import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MealInput from './components/MealInput';
import MealList from './components/MealList';
import ProgressChart from './components/ProgressChart';
import WaterSleep from './components/WaterSleep';
import EnhancedAISuggestion from './components/EnhancedAISuggestion';
import MotivationQuote from './components/MotivationQuote';
import Footer from './components/Footer';
import DailyStreakBar from './components/DailyStreakBar';
import SmartProgress from './components/SmartProgress';
import SmartGoals from './components/SmartGoals';
import storage from './utils/storage';
import decimal from './utils/decimalMath';

function App() {
  const [dailyData, setDailyData] = useState(() => storage.loadDailyData());
  const [history, setHistory] = useState(() => storage.loadHistory());
  const [userData, setUserData] = useState(() => ({
    weight: 70, // default values
    height: 170,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    goals: 'weightLoss',
    fitnessLevel: 'intermediate',
    preferences: {}
  }));

  // Rollover if needed and initialize state
  function recalcTotals(data) {
    const meals = data.meals || [];
    const totals = meals.reduce((acc, meal) => {
      return {
        calories: decimal.add(acc.calories, Number(meal.calories || 0)),
        protein: decimal.add(acc.protein, Number(meal.protein || 0)),
        carbs: decimal.add(acc.carbs, Number(meal.carbs || 0)),
        fat: decimal.add(acc.fat, Number(meal.fat || 0))
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // format
    return {
      calories: Math.round(totals.calories),
      protein: decimal.round(totals.protein, 1),
      carbs: decimal.round(totals.carbs, 1),
      fat: decimal.round(totals.fat, 1)
    };
  }

  useEffect(() => {
    // Rollover if needed
    const rolled = storage.resetIfNewDay();
    const current = rolled || storage.loadDailyData();
    const totals = recalcTotals(current);
    const merged = { ...current, ...totals };
    setDailyData(merged);
    // refresh history
    setHistory(storage.loadHistory());
    // ensure document title
    document.title = 'FitTrack AI — Your Smart Fitness Partner';
  }, []);

  useEffect(() => {
    if (dailyData) {
      storage.saveDailyData(dailyData);
    }
  }, [dailyData]);

  const handleUpdateGoals = (goals) => {
    setDailyData(prev => ({
      ...prev,
      goals
    }));
  };

  const handleAddMeal = (meal) => {
    setDailyData(prev => {
      const meals = [...(prev.meals || []), meal];
      const totals = recalcTotals({ meals });
      const merged = { ...prev, meals, ...totals };
      storage.saveDailyData(merged);
      return merged;
    });

    // Update history
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => {
      const updated = [...prev, { date: today, ...dailyData }];
      storage.saveHistory(updated);
      return updated;
    });
  };

  const handleDeleteMeal = (index) => {
    setDailyData(prev => {
      const meals = prev.meals.filter((_, i) => i !== index);
      const totals = recalcTotals({ meals });
      const merged = { ...prev, meals, ...totals };
      storage.saveDailyData(merged);
      return merged;
    });
  };

  const handleUpdateWaterSleep = (data) => {
    setDailyData(prev => {
      const merged = { ...prev, ...data };
      storage.saveDailyData(merged);
      return merged;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <DailyStreakBar dailyData={dailyData} />
        
        <Dashboard dailyData={dailyData} />
        
        {/* Enhanced AI Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedAISuggestion 
            dailyData={dailyData} 
            userData={userData} 
          />
          <SmartProgress 
            userData={userData} 
            history={history} 
          />
        </div>

        <SmartGoals 
          userData={userData} 
          onUpdateGoals={handleUpdateGoals} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MealInput onAddMeal={handleAddMeal} />
          <WaterSleep 
            dailyData={dailyData} 
            onUpdate={handleUpdateWaterSleep} 
          />
        </div>

        <MealList 
          meals={dailyData.meals || []} 
          onDeleteMeal={handleDeleteMeal} 
        />
        
        <ProgressChart history={history} />
        
        <MotivationQuote />
        
        <Footer />
      </div>
    </div>
  );
}

export default App;