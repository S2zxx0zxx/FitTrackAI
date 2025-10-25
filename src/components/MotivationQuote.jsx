import React, { useEffect, useState } from 'react';

const QUOTES = [
  'Discipline beats motivation — every day.',
  'Small progress is still progress.',
  'Your future self will thank you.',
  'Make habits, not excuses.',
  'Consistency over intensity.'
];

const getTodayKey = () => new Date().toISOString().slice(0,10);

const MotivationQuote = ({ dailyData, saveDaily }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const today = getTodayKey();
    const stored = dailyData?.quote_of_day;
    if (stored) {
      setQuote(stored);
    } else {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(q);
      if (saveDaily) {
        const copy = { ...dailyData, quote_of_day: q };
        saveDaily(copy);
      }
    }
  }, []);

  return (
    <div className="card text-center">
      <div className="text-3xl mb-4">💭</div>
      <p className="text-xl font-medium">{quote}</p>
    </div>
  );
};

export default MotivationQuote;