import { motion } from 'framer-motion';

function ProgressBar({ progress }) {
  const percentage = progress?.percentage || 0;
  const currentPlatform = progress?.currentPlatform || '';
  const platformsSearched = progress?.platformsSearched || 0;
  const totalPlatforms = progress?.totalPlatforms || 25;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-cyber-gray-400 font-mono">
          {currentPlatform || 'Initializing search...'}
        </span>
        <span className="text-neon-blue font-mono">
          {platformsSearched}/{totalPlatforms} platforms
        </span>
      </div>

      <div className="progress-bar h-2 rounded-full overflow-hidden">
        <motion.div
          className="progress-fill h-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex justify-between text-xs text-cyber-gray-500">
        <span>{Math.round(percentage)}% complete</span>
        <span>Estimating time remaining...</span>
      </div>
    </div>
  );
}

export default ProgressBar;
