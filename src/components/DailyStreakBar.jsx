import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DailyStreakBar = () => {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      // Load existing data from localStorage
      const savedStreak = localStorage.getItem('dailyStreak') || 0;
      const savedCoins = localStorage.getItem('userCoins') || 0;
      const lastLogin = localStorage.getItem('lastLoginDate');
      const today = new Date().toDateString();

      if (lastLogin !== today) {
        // New day login - award coins and update streak
        const newCoins = parseInt(savedCoins) + 10;
        setCoins(newCoins);
        localStorage.setItem('userCoins', newCoins);
        localStorage.setItem('lastLoginDate', today);

        // Check if streak should continue or reset
        if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
          // Yesterday - continue streak
          const newStreak = parseInt(savedStreak) + 1;
          setStreak(newStreak);
          localStorage.setItem('dailyStreak', newStreak);
          
          // Check for milestone days
          if ([7, 14, 21, 30].includes(newStreak)) {
            setShowTrophy(true);
            setTimeout(() => setShowTrophy(false), 3000);
          }
        } else {
          // Streak broken - reset
          setStreak(1);
          localStorage.setItem('dailyStreak', 1);
        }
      } else {
        // Same day login - just load saved values
        setStreak(parseInt(savedStreak));
        setCoins(parseInt(savedCoins));
      }
    };

    loadUserData();
  }, []);

  return (
    <motion.nav 
      className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="text-xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          FitTrack AI
        </motion.div>

        <motion.div 
          className="flex items-center space-x-2 text-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.5 }}
        >
          🔥 Daily Streak: Day {streak} / 30
          <AnimatePresence>
            {showTrophy && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="ml-2"
              >
                🏆
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="flex items-center space-x-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-yellow-400">💰</span>
          <motion.span
            key={coins}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {coins}
          </motion.span>
          <span className="text-sm ml-1">Coins</span>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default DailyStreakBar;