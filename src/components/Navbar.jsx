import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const NavLink = ({ href, text }) => (
  <motion.a 
    href={href}
    className="text-textWhite hover:text-primary transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {text}
  </motion.a>
);

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 glass z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🏋️</span>
          <span className="text-xl font-bold text-primary">FitTrack AI</span>
        </motion.div>
        
        <div className="hidden md:flex space-x-8">
          <NavLink href="#dashboard" text="Home" />
          <NavLink href="#meals" text="Meals" />
          <NavLink href="#progress" text="Progress" />
          <NavLink href="#coach" text="Coach" />
        </div>

        <motion.div 
          className="w-8 h-8 rounded-full border border-primary cursor-pointer bg-primary/20 flex items-center justify-center text-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          👤
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;