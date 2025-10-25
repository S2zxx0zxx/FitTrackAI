import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MealInput from './components/MealInput';
import Progress from './components/Progress';
import WaterSleep from './components/WaterSleep';
import AISuggestion, { MotivationQuote } from './components/AISuggestion';
import { saveToLocalStorage, getFromLocalStorage, clearDailyData } from './utils/storage';

function App() {
  const [dailyData, setDailyData] = useState({
    meals: [],
    water: 0,
    sleep: 7,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const weeklyData = [
    { day: 'Mon', protein: 120 },
    { day: 'Tue', protein: 145 },
    { day: 'Wed', protein: 135 },
    { day: 'Thu', protein: 150 },
    { day: 'Fri', protein: 130 },
    { day: 'Sat', protein: 0 },
    { day: 'Sun', protein: 0 }
  ];

  useEffect(() => {
    // Clear data if it's a new day
    clearDailyData();

    // Load saved data
    const savedMeals = getFromLocalStorage('meals', []);
    const savedWater = getFromLocalStorage('water', 0);
    const savedSleep = getFromLocalStorage('sleep', 7);

    // Calculate totals
    const totals = savedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setDailyData({
      meals: savedMeals,
      water: savedWater,
      sleep: savedSleep,
      ...totals
    });
  }, []);

  const handleAddMeal = (meal) => {
    const newMeals = [...dailyData.meals, meal];
    setDailyData(prev => ({
      ...prev,
      meals: newMeals,
      calories: prev.calories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fat: prev.fat + meal.fat
    }));
    saveToLocalStorage('meals', newMeals);
  };

  const handleWaterAdd = (amount) => {
    const newWater = dailyData.water + amount;
    setDailyData(prev => ({ ...prev, water: newWater }));
    saveToLocalStorage('water', newWater);
  };

  const handleSleepChange = (hours) => {
    setDailyData(prev => ({ ...prev, sleep: hours }));
    saveToLocalStorage('sleep', hours);
  };

  return (
    <div className="min-h-screen bg-bgDark text-textWhite pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 space-y-8">
        <Dashboard dailyData={dailyData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MealInput onAddMeal={handleAddMeal} />
          <div className="space-y-6">
            <AISuggestion />
            <MotivationQuote />
          </div>
        </div>
        
        <Progress weeklyData={weeklyData} />
        <WaterSleep 
          onWaterAdd={handleWaterAdd}
          onSleepChange={handleSleepChange}
        />
      </main>
    </div>
  );
}

export default App;