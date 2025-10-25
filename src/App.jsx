import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MealInput from './components/MealInput';
import MealList from './components/MealList';
import ProgressChart from './components/ProgressChart';
import WaterSleep from './components/WaterSleep';
import AISuggestion from './components/AISuggestion';
import MotivationQuote from './components/MotivationQuote';
import Footer from './components/Footer';
import storage from './utils/storage';

function App() {
  const [dailyData, setDailyData] = useState(() => storage.loadDailyData());
  const [history, setHistory] = useState(() => storage.loadHistory());

  useEffect(() => {
    // Rollover if needed
    const rolled = storage.resetIfNewDay();
    if (rolled) setDailyData(rolled);
    // refresh history
    setHistory(storage.loadHistory());
    // ensure document title
    document.title = 'FitTrack AI — Your Smart Fitness Partner';
  }, []);

  const recalcTotals = (data) => {
    const totals = (data.meals || []).reduce((acc, meal) => ({
      calories: acc.calories + Number(meal.calories || 0),
      protein: acc.protein + Number(meal.protein || 0),
      carbs: acc.carbs + Number(meal.carbs || 0),
      fat: acc.fat + Number(meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    return totals;
  };

  const persist = (nextDaily) => {
    storage.saveDailyData(nextDaily);
    setDailyData(nextDaily);
  };

  const handleAddMeal = (meal) => {
    const newMeal = { ...meal, id: Date.now(), timestamp: new Date().toISOString() };
    const next = { ...dailyData, meals: [...(dailyData.meals || []), newMeal] };
    const totals = recalcTotals(next);
    const merged = { ...next, ...totals };
    persist(merged);
  };

  const handleDeleteMeal = (id) => {
    const next = { ...dailyData, meals: (dailyData.meals || []).filter(m => m.id !== id) };
    const totals = recalcTotals(next);
    const merged = { ...next, ...totals };
    persist(merged);
  };

  const handleWaterAdd = (amount) => {
    const next = { ...dailyData, water_ml: (dailyData.water_ml || 0) + amount };
    persist(next);
  };

  const handleSleepChange = (hours) => {
    const next = { ...dailyData, sleep_hours: hours };
    persist(next);
  };

  return (
    <div className="min-h-screen bg-bgDark text-textWhite pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 space-y-8 pb-28">
        <Dashboard dailyData={dailyData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MealInput onAddMeal={handleAddMeal} />
              <div className="space-y-6">
                <AISuggestion dailyData={dailyData} />
                <MotivationQuote dailyData={dailyData} saveDaily={storage.saveDailyData} />
              </div>
            </div>

            <ProgressChart history={history} />
          </div>

          <div className="space-y-6">
            <MealList meals={dailyData.meals || []} onDelete={handleDeleteMeal} />
            <WaterSleep 
              onWaterAdd={handleWaterAdd}
              onSleepChange={handleSleepChange}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;