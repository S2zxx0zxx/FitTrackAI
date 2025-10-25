import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 glass z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🏋️</span>
          <span className="text-xl font-bold text-primary">FitTrack AI</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <NavLink href="#" text="Home" />
          <NavLink href="#" text="Meals" />
          <NavLink href="#" text="Progress" />
          <NavLink href="#" text="Coach" />
        </div>

        <div 
          className="w-8 h-8 rounded-full border border-primary cursor-pointer bg-primary/20 flex items-center justify-center text-sm"
        >
          👤
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, text }) => (
  <a 
    href={href}
    className="text-textWhite hover:text-primary transition-colors"
  >
    {text}
  </a>
);

export default Navbar;