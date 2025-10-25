import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import { round } from '../utils/decimalMath';
import { AI } from '../utils/aiService';

const EnhancedAISuggestion = ({ dailyData, userData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const { goal, current, remaining } = useMemo(() => {
    const goal = (dailyData?.goals?.protein) || 150;
    const current = Number(dailyData?.protein) || 0;
    const remaining = Math.max(0, round((goal - current), 1));
    return { goal, current, remaining };
  }, [dailyData]);

  useEffect(() => {
    if (dailyData && userData) {
      // Analyze nutrition data
      const nutritionAnalysis = AI.analyzeNutrition(dailyData.meals || []);
      setSuggestions(nutritionAnalysis.recommendations);

      // Generate workout suggestion
      const workout = AI.suggestWorkout(userData.goals, userData.fitnessLevel);
      setWorkoutPlan(workout);
    }
  }, [dailyData, userData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-primary/10 glow"
    >
      <div className="flex flex-col space-y-4">
        {/* Protein tracking (existing feature) */}
        <div className="flex items-start space-x-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-primary">AI Coach</h2>
            <p className="text-lg mb-2">
              {remaining > 0 
                ? `You're ${remaining}g short on protein today — add paneer or eggs.` 
                : `Great job — you've met your protein goal!`}
            </p>
          </div>
        </div>

        {/* Nutrition Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Nutritional Insights</h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span>•</span>
                  <span>{suggestion.message}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Workout Plan */}
        {workoutPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <h3 className="text-lg font-semibold mb-2">Today's Workout Plan</h3>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <span className="font-medium">{workoutPlan.type}</span>
                <span>{workoutPlan.duration} minutes</span>
              </div>
              <ul className="space-y-2">
                {workoutPlan.exercises.map((exercise, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{exercise.name}</span>
                    <span className="text-gray-600">
                      {exercise.sets && `${exercise.sets} sets`}
                      {exercise.reps && ` × ${exercise.reps}`}
                      {exercise.duration && ` for ${exercise.duration}`}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

EnhancedAISuggestion.propTypes = {
  dailyData: PropTypes.shape({
    protein: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    goals: PropTypes.shape({
      protein: PropTypes.number,
    }),
    meals: PropTypes.array,
  }),
  userData: PropTypes.shape({
    goals: PropTypes.string,
    fitnessLevel: PropTypes.string,
  }),
};

EnhancedAISuggestion.defaultProps = {
  dailyData: {
    protein: 0,
    goals: {
      protein: 150,
    },
    meals: [],
  },
  userData: {
    goals: 'weightLoss',
    fitnessLevel: 'beginner'
  },
};

export default EnhancedAISuggestion;