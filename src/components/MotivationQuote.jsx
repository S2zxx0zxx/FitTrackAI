import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const QUOTES = [
  'Discipline beats motivation — every day.',
  'Small progress is still progress.',
  'Your future self will thank you.',
  'Make habits, not excuses.',
  'Consistency over intensity.'
];

const getTodayKey = () => new Date().toISOString().slice(0,10);

const MotivationQuote = ({ dailyData, saveDaily }) => {
  const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const initial = dailyData?.quote_of_day || randomQuote;
  const [quote, setQuote] = useState(initial);

  useEffect(() => {
    // If there's no stored quote, persist the generated one.
    if (!dailyData?.quote_of_day && saveDaily) {
      saveDaily({ ...dailyData, quote_of_day: quote });
    }
    // Run when quote or storage changes
  }, [dailyData?.quote_of_day, saveDaily, quote]);

  return (
    <div className="card text-center">
      <div className="text-3xl mb-4">💭</div>
      <p className="text-xl font-medium">{quote}</p>
    </div>
  );
};

MotivationQuote.propTypes = {
  dailyData: PropTypes.object,
  saveDaily: PropTypes.func,
};

export default MotivationQuote;