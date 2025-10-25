/**
 * AI Service for FitTrack - Provides intelligent health and fitness recommendations
 */

const calculateBMR = (weight, height, age, gender, activityLevel) => {
  // Harris-Benedict Equation
  let bmr = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  // Activity level multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  return Math.round(bmr * (multipliers[activityLevel] || multipliers.moderate));
};

const generateMealPlan = (calories, _preferences = {}) => {
  const mealDistribution = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.3,
    snacks: 0.1
  };

  const macroRatios = {
    protein: 0.3,
    carbs: 0.4,
    fat: 0.3
  };

  return Object.entries(mealDistribution).map(([meal, portion]) => {
    const mealCalories = Math.round(calories * portion);
    return {
      meal,
      calories: mealCalories,
      protein: Math.round((mealCalories * macroRatios.protein) / 4), // 4 cal/g for protein
      carbs: Math.round((mealCalories * macroRatios.carbs) / 4),    // 4 cal/g for carbs
      fat: Math.round((mealCalories * macroRatios.fat) / 9)         // 9 cal/g for fat
    };
  });
};

const predictProgress = (currentStats, goalStats, consistency) => {
  const weeklyProgress = {
    weight: consistency * 0.5, // kg per week
    strength: consistency * 2.5, // % increase per week
    endurance: consistency * 3.0 // % increase per week
  };

  const weeksToGoal = Object.keys(goalStats).map(stat => {
    const difference = Math.abs(goalStats[stat] - currentStats[stat]);
    return difference / weeklyProgress[stat];
  });

  return Math.ceil(Math.max(...weeksToGoal));
};

const suggestWorkout = (goals, fitnessLevel, _equipment = []) => {
  const workoutTypes = {
    weightLoss: {
      type: 'HIIT',
      duration: 30,
      exercises: [
        { name: 'Burpees', sets: 3, duration: '30 seconds' },
        { name: 'Mountain Climbers', sets: 3, duration: '30 seconds' },
        { name: 'Jump Squats', sets: 3, duration: '30 seconds' },
        { name: 'Push-ups', sets: 3, duration: '30 seconds' }
      ]
    },
    muscleGain: {
      type: 'Strength Training',
      duration: 45,
      exercises: [
        { name: 'Push-ups', sets: 4, reps: '8-12' },
        { name: 'Squats', sets: 4, reps: '8-12' },
        { name: 'Dips', sets: 3, reps: '8-12' },
        { name: 'Lunges', sets: 3, reps: '12-15' }
      ]
    },
    endurance: {
      type: 'Cardio',
      duration: 40,
      exercises: [
        { name: 'Running', duration: '20 minutes', intensity: 'moderate' },
        { name: 'Cycling', duration: '15 minutes', intensity: 'high' },
        { name: 'Jump Rope', duration: '5 minutes', intensity: 'high' }
      ]
    }
  };

  return workoutTypes[goals] || workoutTypes.weightLoss;
};

const analyzeNutrition = (meals) => {
  const dailyRecommended = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
    fiber: 28,
    sugar: 50,
    sodium: 2300
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return {
    totals,
    percentages: {
      calories: (totals.calories / dailyRecommended.calories) * 100,
      protein: (totals.protein / dailyRecommended.protein) * 100,
      carbs: (totals.carbs / dailyRecommended.carbs) * 100,
      fat: (totals.fat / dailyRecommended.fat) * 100
    },
    recommendations: generateRecommendations(totals, dailyRecommended)
  };
};

const generateRecommendations = (totals, targets) => {
  const recommendations = [];
  const threshold = 0.9; // 90% of target

  if (totals.calories < targets.calories * threshold) {
    recommendations.push({
      type: 'calories',
      message: 'Consider increasing your calorie intake to meet daily energy needs',
      deficit: Math.round(targets.calories - totals.calories)
    });
  }

  if (totals.protein < targets.protein * threshold) {
    recommendations.push({
      type: 'protein',
      message: 'Increase protein intake to support muscle maintenance and recovery',
      deficit: Math.round(targets.protein - totals.protein)
    });
  }

  return recommendations;
};

export const AI = {
  calculateBMR,
  generateMealPlan,
  predictProgress,
  suggestWorkout,
  analyzeNutrition
};