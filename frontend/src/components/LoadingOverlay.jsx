import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

function LoadingOverlay({ progress }) {
  return (
    <motion.div
      className="fixed inset-0 bg-cyber-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="cyber-card rounded-lg p-8 max-w-md w-full mx-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Animated spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-neon-blue rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-neon-purple rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-4 border-4 border-transparent border-t-neon-green rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          <FaSpinner className="absolute inset-0 m-auto text-2xl text-neon-blue animate-pulse" />
        </div>

        <h3 className="text-xl font-cyber text-white mb-2">
          {progress?.status === 'running' ? 'Scanning...' : 'Initializing...'}
        </h3>
        
        <p className="text-cyber-gray-400 mb-4">
          {progress?.currentPlatform || 'Preparing search engines...'}
        </p>

        {/* Progress stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded bg-cyber-dark-800">
            <div className="text-neon-blue font-bold text-lg">
              {progress?.platformsSearched || 0}/{progress?.totalPlatforms || 25}
            </div>
            <div className="text-cyber-gray-500 text-xs">Platforms</div>
          </div>
          <div className="p-3 rounded bg-cyber-dark-800">
            <div className="text-neon-green font-bold text-lg">
              {progress?.resultsFound || 0}
            </div>
            <div className="text-cyber-gray-500 text-xs">Results Found</div>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-blue"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LoadingOverlay;
