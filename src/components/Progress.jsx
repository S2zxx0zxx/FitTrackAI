import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = ({ weeklyData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Weekly Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  background: '#000',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="protein"
                stroke="#00FF9D"
                strokeWidth={2}
                dot={{ fill: '#00FF9D' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <motion.div
        className="card"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Current Streak</h2>
          <span className="text-3xl">🔥</span>
        </div>
        <div className="text-6xl font-bold text-primary mb-2">5</div>
        <div className="text-lg opacity-70">Days in a row</div>
        <div className="mt-4 p-4 bg-white/5 rounded-xl">
          <div className="text-sm opacity-70 mb-1">Next milestone</div>
          <div className="font-medium">7 days - "Week Warrior" 💪</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Progress;