import { motion } from 'framer-motion';

const AISuggestion = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-primary/10 glow"
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">🤖</div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-primary">AI Coach Suggestion</h2>
          <p className="text-lg">
            You're 20g short on protein today — add paneer or eggs.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const MotivationQuote = () => {
  const quotes = [
    "Discipline beats motivation — every day.",
    "Small progress is still progress.",
    "Your future self will thank you.",
    "Make habits, not excuses.",
    "Consistency over intensity.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center"
    >
      <div className="text-3xl mb-4">💭</div>
      <p className="text-xl font-medium">{randomQuote}</p>
    </motion.div>
  );
};

export default AISuggestion;