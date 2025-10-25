import { motion } from 'framer-motion';
import { useState } from 'react';

const WaterSleep = ({ onWaterAdd, onSleepChange }) => {
  const [sleepHours, setSleepHours] = useState(7);

  const getSleepInsight = (hours) => {
    if (hours < 6) return "⚠️ Aim for more rest to improve recovery";
    if (hours === 7) return "✨ 7 hrs sleep = optimal recovery!";
    if (hours > 8) return "💪 Great sleep duration for muscle growth";
    return "😴 Good sleep routine!";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Water Intake</h2>
        <button
          onClick={() => onWaterAdd(250)}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-bold py-4 px-6 rounded-xl mb-4 flex items-center justify-center space-x-2 transition-colors"
        >
          <span>💧</span>
          <span>Add 250ml</span>
        </button>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">1500ml</div>
          <div className="text-sm opacity-70">of 3000ml daily goal</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-6">Sleep Tracker</h2>
        <div className="mb-4">
          <input
            type="range"
            min="5"
            max="9"
            value={sleepHours}
            onChange={(e) => {
              setSleepHours(Number(e.target.value));
              onSleepChange(Number(e.target.value));
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm opacity-70">
            <span>5h</span>
            <span>7h</span>
            <span>9h</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{sleepHours} hours</div>
          <div className="text-sm bg-white/5 p-3 rounded-xl">
            {getSleepInsight(sleepHours)}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WaterSleep;