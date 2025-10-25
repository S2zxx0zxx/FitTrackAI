import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';

const achievements = {
  workoutStreak: {
    name: 'Workout Warrior',
    levels: [
      { days: 3, xp: 100, title: 'Beginner Warrior' },
      { days: 7, xp: 250, title: 'Dedicated Warrior' },
      { days: 30, xp: 1000, title: 'Elite Warrior' }
    ]
  },
  calorieTracking: {
    name: 'Nutrition Master',
    levels: [
      { days: 5, xp: 150, title: 'Food Tracker' },
      { days: 14, xp: 300, title: 'Nutrition Expert' },
      { days: 30, xp: 800, title: 'Macro Maestro' }
    ]
  },
  waterGoals: {
    name: 'Hydration Hero',
    levels: [
      { days: 3, xp: 50, title: 'Water Enthusiast' },
      { days: 7, xp: 150, title: 'Hydration Champion' },
      { days: 14, xp: 400, title: 'Aqua Master' }
    ]
  },
  weightGoals: {
    name: 'Goal Crusher',
    levels: [
      { progress: 25, xp: 200, title: 'Progress Maker' },
      { progress: 50, xp: 500, title: 'Half Way Hero' },
      { progress: 100, xp: 1500, title: 'Goal Achieved!' }
    ]
  }
};

const useGamification = create(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      achievements: [],
      streaks: {
        workout: 0,
        nutrition: 0,
        water: 0
      },
      recentRewards: [],

      addXP: (amount) => {
        set(state => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          
          if (newLevel > state.level) {
            // Level up celebration
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

          return {
            xp: newXP,
            level: newLevel,
            recentRewards: [
              { type: 'xp', amount, timestamp: Date.now() },
              ...state.recentRewards
            ].slice(0, 5)
          };
        });
      },

      checkAchievements: (stats) => {
        const state = get();
        const newAchievements = [];

        // Check workout streak achievements
        const workoutLevel = achievements.workoutStreak.levels.find(
          level => stats.workoutStreak >= level.days &&
          !state.achievements.find(a => 
            a.name === achievements.workoutStreak.name &&
            a.level === level.days
          )
        );

        if (workoutLevel) {
          newAchievements.push({
            name: achievements.workoutStreak.name,
            level: workoutLevel.days,
            title: workoutLevel.title,
            xp: workoutLevel.xp,
            achievedAt: Date.now()
          });
        }

        // Check nutrition tracking achievements
        const nutritionLevel = achievements.calorieTracking.levels.find(
          level => stats.nutritionStreak >= level.days &&
          !state.achievements.find(a => 
            a.name === achievements.calorieTracking.name &&
            a.level === level.days
          )
        );

        if (nutritionLevel) {
          newAchievements.push({
            name: achievements.calorieTracking.name,
            level: nutritionLevel.days,
            title: nutritionLevel.title,
            xp: nutritionLevel.xp,
            achievedAt: Date.now()
          });
        }

        // Award XP for new achievements
        newAchievements.forEach(achievement => {
          get().addXP(achievement.xp);
        });

        // Update state with new achievements
        if (newAchievements.length > 0) {
          set(state => ({
            achievements: [...state.achievements, ...newAchievements],
            recentRewards: [
              ...newAchievements.map(a => ({
                type: 'achievement',
                achievement: a,
                timestamp: Date.now()
              })),
              ...state.recentRewards
            ].slice(0, 5)
          }));

          // Celebrate achievements
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.7 }
          });
        }
      },

      updateStreaks: (type, value) => {
        set(state => ({
          streaks: {
            ...state.streaks,
            [type]: value
          }
        }));
      },

      getProgress: () => {
        const state = get();
        return {
          currentLevel: state.level,
          xp: state.xp,
          nextLevelXP: state.level * 1000,
          achievements: state.achievements,
          streaks: state.streaks,
          recentRewards: state.recentRewards
        };
      }
    }),
    {
      name: 'fittrack-gamification'
    }
  )
);

export default useGamification;