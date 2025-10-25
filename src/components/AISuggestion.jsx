import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { round } from '../utils/decimalMath';

const AISuggestion = ({ dailyData }) => {
  const { goal, current, remaining } = useMemo(() => {
    const goal = (dailyData?.goals?.protein) || 150;
    const current = Number(dailyData?.protein) || 0;
    const remaining = Math.max(0, round((goal - current), 1));
    return { goal, current, remaining };
  }, [dailyData]);

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
            {remaining > 0 ? `You're ${remaining} g short on protein today — add paneer or eggs.` : `Great job — you've met your protein goal!`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

AISuggestion.propTypes = {
  dailyData: PropTypes.shape({
    protein: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    goals: PropTypes.shape({
      protein: PropTypes.number,
    }),
  }),
};

AISuggestion.defaultProps = {
  dailyData: {
    protein: 0,
    goals: {
      protein: 150,
    },
  },
};

export default AISuggestion;