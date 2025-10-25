import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { AI } from '../utils/aiService';

const SmartProgress = ({ userData, history }) => {
  const [predictions, setPredictions] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (history && history.length > 0) {
      // Calculate predictions
      const currentStats = {
        weight: history[history.length - 1].weight,
        strength: history[history.length - 1].strength || 0,
        endurance: history[history.length - 1].endurance || 0
      };

      const goalStats = userData.goals || {
        weight: currentStats.weight - 5, // Default goal: lose 5kg
        strength: currentStats.strength * 1.2, // Increase strength by 20%
        endurance: currentStats.endurance * 1.3 // Increase endurance by 30%
      };

      const consistency = calculateConsistency(history);
      const weeksToGoal = AI.predictProgress(currentStats, goalStats, consistency);

      // Generate prediction data
      const predictionData = generatePredictionData(currentStats, goalStats, weeksToGoal);
      setPredictions(predictionData);

      // Prepare chart data
      const chartData = prepareChartData(history, predictionData);
      setChartData(chartData);
    }
  }, [history, userData]);

  const calculateConsistency = (history) => {
    if (history.length < 7) return 0.5; // Default to moderate consistency
    const recentEntries = history.slice(-7);
    const daysLogged = recentEntries.filter(entry => entry.meals?.length > 0).length;
    return daysLogged / 7;
  };

  const generatePredictionData = (current, goals, weeks) => {
    const predictions = [];
    const totalSteps = weeks * 7; // Daily predictions

    for (let i = 1; i <= totalSteps; i++) {
      const progress = i / totalSteps;
      predictions.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        weight: current.weight + (goals.weight - current.weight) * progress,
        strength: current.strength + (goals.strength - current.strength) * progress,
        endurance: current.endurance + (goals.endurance - current.endurance) * progress
      });
    }

    return predictions;
  };

  const prepareChartData = (history, predictions) => {
    const labels = [
      ...history.map(h => new Date(h.date).toLocaleDateString()),
      ...predictions.map(p => p.date.toLocaleDateString())
    ];

    const datasets = [
      {
        label: 'Actual Progress',
        data: [...history.map(h => h.weight), null, ...Array(predictions.length - 1).fill(null)],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predicted Progress',
        data: [...Array(history.length).fill(null), ...predictions.map(p => p.weight)],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ];

    return { labels, datasets };
  };

  if (!chartData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Smart Progress Tracking</h2>
      
      {/* Progress Chart */}
      <div className="h-64 mb-6">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              tooltip: {
                enabled: true
              },
              legend: {
                display: true
              }
            },
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }}
        />
      </div>

      {/* Predictions and Insights */}
      {predictions && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Projected Timeline</h4>
              <p className="text-gray-600">
                You're on track to reach your goal in approximately{' '}
                <span className="font-semibold text-primary">
                  {Math.ceil(predictions.length / 7)} weeks
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Weekly Progress</h4>
              <p className="text-gray-600">
                Average weekly change:{' '}
                <span className="font-semibold text-primary">
                  {((predictions[predictions.length - 1].weight - predictions[0].weight) / (predictions.length / 7)).toFixed(1)} kg
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SmartProgress;