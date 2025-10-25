import { motion } from 'framer-motion';

const AISuggestion = ({ dailyData }) => {
  const goal = (dailyData?.goals?.protein) || 150;
  const current = Number(dailyData?.protein) || 0;
  const remaining = Math.max(0, Math.round((goal - current)*10)/10);

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
            {remaining > 0 ? `You\'re ${remaining} g short on protein today — add paneer or eggs.` : `Great job — you've met your protein goal!`}
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