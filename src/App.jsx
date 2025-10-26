import React, { useState, useEffect, Suspense, lazy } from 'react';
const Dashboard = lazy(() => import('./components/Dashboard'));
import MealInput from './components/MealInput';
const MealList = lazy(() => import('./components/MealList'));
const ProgressChart = lazy(() => import('./components/ProgressChart'));
import WaterSleep from './components/WaterSleep';
const AISuggestion = lazy(() => import('./components/AISuggestion'));
import MotivationQuote from './components/MotivationQuote';
const Footer = lazy(() => import('./components/Footer'));
const DailyStreakBar = lazy(() => import('./components/DailyStreakBar'));
const Navbar = lazy(() => import('./components/Navbar'));
import storage from './utils/storage';
import decimal from './utils/decimalMath';

function App() {
  const [dailyData, setDailyData] = useState(() => storage.loadDailyData());
  const [history, setHistory] = useState(() => storage.loadHistory());

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

  const handleSleepChange = (hours) => {
    const next = { ...dailyData, sleep_hours: hours };
    persist(next);
  };
  return (
    <div className="min-h-screen bg-bgDark text-textWhite pb-20 pt-16">
      <Suspense fallback={null}>
        <DailyStreakBar />
      </Suspense>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      
      <main className="container mx-auto px-4 pt-24 space-y-8 pb-28">
        <Suspense fallback={<div className="card p-4">Loading dashboard...</div>}>
          <Dashboard dailyData={dailyData} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MealInput onAddMeal={handleAddMeal} />
              <div className="space-y-6">
                <Suspense fallback={<div className="p-4">Loading suggestions...</div>}>
                  <AISuggestion dailyData={dailyData} />
                </Suspense>
                <MotivationQuote dailyData={dailyData} saveDaily={storage.saveDailyData} />
              </div>
            </div>

            <Suspense fallback={<div className="card p-4">Loading chart...</div>}>
              <ProgressChart history={history} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="card p-4">Loading meals...</div>}>
              <MealList meals={dailyData.meals || []} onDelete={handleDeleteMeal} />
            </Suspense>
            <WaterSleep
              waterMl={dailyData.water_ml || 0}
                weight={dailyData.weight}
                onUpdate={(newWaterMl) => {
                  const next = { ...dailyData, water_ml: newWaterMl };
                  persist(next);
                }}
                onSleepChange={handleSleepChange}
                onWeightUpdate={(newWeight) => {
                  const next = { ...dailyData, weight: newWeight };
                  persist(next);
                }}
            />
          </div>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;