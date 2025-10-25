import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGamification from '../stores/useGamification';

const GamificationUI = () => {
  const { getProgress, checkAchievements } = useGamification();
  const { currentLevel, xp, nextLevelXP, achievements, recentRewards } = getProgress();

  useEffect(() => {
    // Check achievements whenever component mounts or updates
    checkAchievements({
      workoutStreak: 5, // Example value
      nutritionStreak: 7 // Example value
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total XP</p>
            <p className="text-lg font-semibold">{xp} / {nextLevelXP}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(xp % 1000) / 10}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Recent Rewards */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Recent Rewards</h3>
        <div className="space-y-3">
          <AnimatePresence>
            {recentRewards.map((reward, index) => (
              <motion.div
                key={reward.timestamp}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                {reward.type === 'xp' ? (
                  <>
                    <span className="text-primary font-semibold">+{reward.amount} XP</span>
                    <span className="text-sm text-gray-500">
                      {new Date(reward.timestamp).toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold">{reward.achievement.title}</p>
                      <p className="text-sm text-gray-600">+{reward.achievement.xp} XP</p>
                    </div>
                    <motion.div
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      🏆
                    </motion.div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={`${achievement.name}-${achievement.level}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                  {achievement.name.includes('Workout') ? '💪' :
                   achievement.name.includes('Nutrition') ? '🥗' :
                   achievement.name.includes('Water') ? '💧' : '🎯'}
                </div>
                <div>
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">
                    Earned {new Date(achievement.achievedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Active Challenges</h3>
        <div className="space-y-4">
          <div className="p-4 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">7-Day Workout Challenge</h4>
              <span className="text-primary font-bold">+500 XP</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>5/7 days</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '71.4%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Perfect Nutrition Week</h4>
              <span className="text-primary font-bold">+300 XP</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>3/7 days</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '42.8%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationUI;