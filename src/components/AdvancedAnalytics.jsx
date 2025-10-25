import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const AdvancedAnalytics = ({ userData, history }) => {
  const [trends, setTrends] = useState(null);
  const [correlations, setCorrelations] = useState(null);

  useEffect(() => {
    if (history?.length > 0) {
      analyzeTrends();
      findCorrelations();
    }
  }, [history]);

  const analyzeTrends = () => {
    const trends = {
      weight: calculateTrend(history.map(day => day.weight)),
      calories: calculateTrend(history.map(day => day.calories)),
      protein: calculateTrend(history.map(day => day.protein)),
      sleep: calculateTrend(history.map(day => day.sleep))
    };
    setTrends(trends);
  };

  const calculateTrend = (data) => {
    const n = data.length;
    if (n < 2) return 0;

    const xMean = (n + 1) / 2;
    const yMean = d3.mean(data);

    const ssxy = data.reduce((acc, y, i) => acc + (i + 1 - xMean) * (y - yMean), 0);
    const ssxx = data.reduce((acc, _, i) => acc + Math.pow(i + 1 - xMean, 2), 0);

    return ssxy / ssxx;
  };

  const findCorrelations = () => {
    const correlations = {
      sleepVsCalories: calculateCorrelation(
        history.map(day => day.sleep),
        history.map(day => day.calories)
      ),
      proteinVsWeight: calculateCorrelation(
        history.map(day => day.protein),
        history.map(day => day.weight)
      )
    };
    setCorrelations(correlations);
  };

  const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n < 2) return 0;

    const xMean = d3.mean(x);
    const yMean = d3.mean(y);

    const numerator = x.reduce((acc, xi, i) => 
      acc + (xi - xMean) * (y[i] - yMean), 0);

    const denominator = Math.sqrt(
      x.reduce((acc, xi) => acc + Math.pow(xi - xMean, 2), 0) *
      y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0)
    );

    return numerator / denominator;
  };

  if (!trends || !correlations) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
        
        {/* Trends */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Trends</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(trends).map(([metric, trend]) => (
              <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="capitalize text-gray-700 mb-2">{metric}</h4>
                <div className="flex items-center space-x-2">
                  {trend > 0 ? (
                    <span className="text-green-500">↗</span>
                  ) : (
                    <span className="text-red-500">↘</span>
                  )}
                  <span className="font-semibold">
                    {Math.abs(trend).toFixed(2)} per day
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Correlations */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Insights</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">
                Sleep vs Calorie Intake
              </h4>
              <p className="text-blue-600">
                {Math.abs(correlations.sleepVsCalories) > 0.5 ? (
                  correlations.sleepVsCalories > 0 ?
                    "Better sleep is associated with more consistent calorie intake" :
                    "Poor sleep might be affecting your eating patterns"
                ) : (
                  "No strong correlation between sleep and calorie intake"
                )}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-2">
                Protein vs Weight Goals
              </h4>
              <p className="text-purple-600">
                {Math.abs(correlations.proteinVsWeight) > 0.5 ? (
                  correlations.proteinVsWeight > 0 ?
                    "Higher protein intake is supporting your muscle growth goals" :
                    "Consider adjusting protein intake to better support your goals"
                ) : (
                  "No clear relationship between protein intake and weight changes"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Model */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">AI Predictions</h2>
        <div className="space-y-4">
          {Object.entries(trends).map(([metric, trend]) => {
            const prediction = history[history.length - 1][metric] + (trend * 30);
            return (
              <div key={metric} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="capitalize font-medium text-gray-700">{metric}</h4>
                  <p className="text-sm text-gray-500">30-day projection</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {prediction.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {trend > 0 ? '+' : ''}{(trend * 30).toFixed(1)} change
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;