import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const WorkoutCompanion = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [reps, setReps] = useState(0);
  const speechSynthesis = window.speechSynthesis;
  const timerRef = useRef(null);

  const workoutPlan = [
    { name: 'Push-ups', duration: 60, targetReps: 20 },
    { name: 'Squats', duration: 60, targetReps: 15 },
    { name: 'Plank', duration: 30, isHold: true },
    { name: 'Mountain Climbers', duration: 45, targetReps: 30 },
    { name: 'Burpees', duration: 60, targetReps: 12 }
  ];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setCurrentExercise(workoutPlan[0]);
    setTimeRemaining(workoutPlan[0].duration);
    speak(`Starting workout with ${workoutPlan[0].name}`);
  };

  const updateTimer = () => {
    setTimeRemaining(prev => {
      if (prev <= 1) {
        const currentIndex = workoutPlan.findIndex(ex => ex.name === currentExercise.name);
        if (currentIndex < workoutPlan.length - 1) {
          const nextExercise = workoutPlan[currentIndex + 1];
          setCurrentExercise(nextExercise);
          speak(`Next exercise: ${nextExercise.name}`);
          return nextExercise.duration;
        } else {
          setIsWorkoutActive(false);
          speak('Workout complete! Great job!');
          return 0;
        }
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (isWorkoutActive && timeRemaining > 0) {
      timerRef.current = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isWorkoutActive, currentExercise]);

  useEffect(() => {
    if (timeRemaining === 10) {
      speak('10 seconds remaining');
    }
  }, [timeRemaining]);

  const handleRep = () => {
    if (!currentExercise?.isHold) {
      setReps(prev => prev + 1);
      if (reps + 1 === currentExercise?.targetReps) {
        speak('Target reps achieved! Keep going!');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">AI Workout Companion</h2>

      {!isWorkoutActive ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-primary text-white rounded-lg text-lg font-semibold"
          onClick={startWorkout}
        >
          Start Workout
        </motion.button>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{currentExercise.name}</h3>
            <p className="text-4xl font-bold text-primary">{timeRemaining}s</p>
          </div>

          {!currentExercise.isHold && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-secondary text-white rounded-full text-lg"
                onClick={handleRep}
              >
                Count Rep
              </motion.button>
              <p className="mt-4 text-lg">
                Reps: <span className="font-bold">{reps}</span> / {currentExercise.targetReps}
              </p>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Coming Up Next:</h4>
            {workoutPlan.slice(workoutPlan.findIndex(ex => ex.name === currentExercise.name) + 1)
              .map((exercise, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span>{exercise.name}</span>
                  <span>{exercise.duration}s</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCompanion;