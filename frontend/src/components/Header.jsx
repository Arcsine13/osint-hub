import { motion } from 'framer-motion';
import { FaShieldAlt, FaGithub, FaExclamationTriangle } from 'react-icons/fa';

function Header({ connected }) {
  return (
    <header className="border-b border-cyber-gray-600 bg-cyber-dark-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <FaShieldAlt className="text-4xl text-neon-blue" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-cyber font-bold text-white tracking-wider">
                <span className="text-neon-blue neon-text">OSINT</span>
                <span className="text-neon-purple neon-text-purple ml-2">HUB</span>
              </h1>
              <p className="text-xs text-cyber-gray-400 tracking-widest">
                CYBER INTELLIGENCE PLATFORM
              </p>
            </div>
          </motion.div>

          {/* Status and Links */}
          <div className="flex items-center gap-6">
            {/* Connection Status */}
            <motion.div 
              className="flex items-center gap-2 px-3 py-1 rounded border border-cyber-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={connected ? 'status-online' : 'status-offline'} />
              <span className="text-xs font-mono text-cyber-gray-400">
                {connected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </motion.div>

            {/* Warning Badge */}
            <motion.div 
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-neon-yellow/10 border border-neon-yellow/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FaExclamationTriangle className="text-neon-yellow text-sm" />
              <span className="text-xs text-neon-yellow">AUTHORIZED USE ONLY</span>
            </motion.div>

            {/* GitHub Link */}
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-gray-400 hover:text-neon-blue transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FaGithub className="text-xl" />
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
