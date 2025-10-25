import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ dailyData }) => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [water, setWater] = useState(0);

  useEffect(() => {
    // Animate counters
    const targetCalories = dailyData.calories || 0;
    const targetProtein = dailyData.protein || 0;
    const targetWater = dailyData.water_ml || 0;

    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCalories(Math.round(targetCalories * progress));
      setProtein(Math.round(targetProtein * progress));
      setWater(Math.round(targetWater * progress));

      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [dailyData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
    >
      <MetricCard
        title="Calories"
        value={calories}
        goal={dailyData?.goals?.calories || 2000}
        unit="kcal"
      />
      <MetricCard
        title="Protein"
        value={protein}
        goal={dailyData?.goals?.protein || 150}
        unit="g"
        isProtein
      />
      <MetricCard
        title="Water"
        value={water}
        goal={dailyData?.goals?.water || 3000}
        unit="ml"
      />
    </motion.div>
  );
};

const MetricCard = ({ title, value, goal, unit, isProtein }) => {
  const progress = goal ? Math.round((value / goal) * 100) : 0;
  const isExcess = value > goal;
  const barColorClass = isExcess ? 'bg-danger' : 'bg-primary';
  const textColorClass = isExcess ? 'text-danger' : 'text-primary';

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className={`text-3xl font-bold mb-2 ${textColorClass}`}>
        {value} <span className="text-sm opacity-70">{unit}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className={`h-full rounded-full ${barColorClass}`}
        />
      </div>
      <div className="text-sm mt-2 opacity-70">Goal: {goal} {unit}</div>
    </motion.div>
  );
};

export default Dashboard;