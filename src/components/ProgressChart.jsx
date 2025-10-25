import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ history = [] }) => {
  // build 7-day data from history fallback
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let data = [];
  if (history && history.length > 0) {
    // take last 7 entries
    const last7 = history.slice(-7);
    data = last7.map(h => ({ day: h.date.slice(5), protein: Math.round(h.totalProtein) }));
  } else {
    data = [
      { day: 'Mon', protein: 120 },
      { day: 'Tue', protein: 145 },
      { day: 'Wed', protein: 135 },
      { day: 'Thu', protein: 150 },
      { day: 'Fri', protein: 130 },
      { day: 'Sat', protein: 90 },
      { day: 'Sun', protein: 100 }
    ];
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Weekly Protein</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#ffffff40" />
            <YAxis stroke="#ffffff40" />
            <Tooltip contentStyle={{ background: '#000', border: '1px solid #ffffff20', borderRadius: '12px' }} />
            <Line type="monotone" dataKey="protein" stroke="#00FF9D" strokeWidth={2} dot={{ fill: '#00FF9D' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
