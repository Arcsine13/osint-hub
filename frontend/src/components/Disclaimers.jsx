import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

function Disclaimers({ onAccept }) {
  return (
    <motion.div
      className="cyber-card rounded-lg p-8 max-w-2xl w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-block p-4 rounded-full bg-neon-blue/10 mb-4"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 212, 255, 0.3)',
              '0 0 40px rgba(0, 212, 255, 0.5)',
              '0 0 20px rgba(0, 212, 255, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaShieldAlt className="text-5xl text-neon-blue" />
        </motion.div>
        <h2 className="text-3xl font-cyber text-white mb-2">
          <span className="text-neon-blue neon-text">OSINT</span>{' '}
          <span className="text-neon-purple neon-text-purple">HUB</span>
        </h2>
        <p className="text-cyber-gray-400">Cyber Intelligence Platform</p>
      </div>

      {/* Terms */}
      <div className="space-y-4 mb-8">
        <div className="p-4 rounded bg-neon-yellow/10 border border-neon-yellow/30">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-neon-yellow mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-cyber text-neon-yellow mb-1">IMPORTANT NOTICE</h4>
              <p className="text-sm text-cyber-gray-400">
                This tool is for <strong className="text-white">authorized security research</strong> only. 
                All searches are logged with timestamps and IP addresses.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded bg-cyber-dark-800 border border-cyber-gray-600">
          <h4 className="font-cyber text-white mb-2">TERMS OF USE</h4>
          <ul className="text-sm text-cyber-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <FaCheck className="text-neon-green mt-0.5 flex-shrink-0" />
              <span>You will only use this tool for legitimate security research and investigations</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-neon-green mt-0.5 flex-shrink-0" />
              <span>You have proper authorization for any targets you investigate</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-neon-green mt-0.5 flex-shrink-0" />
              <span>You will comply with all applicable laws and regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheck className="text-neon-green mt-0.5 flex-shrink-0" />
              <span>You understand that misuse may result in legal consequences</span>
            </li>
          </ul>
        </div>

        <div className="p-4 rounded bg-cyber-dark-800 border border-cyber-gray-600">
          <h4 className="font-cyber text-white mb-2">DATA PRIVACY</h4>
          <p className="text-sm text-cyber-gray-400">
            All search queries and results are stored securely and automatically deleted 
            after 30 days. We do not sell or share your data with third parties. 
            Search metadata may be used for security monitoring and abuse prevention.
          </p>
        </div>

        <div className="p-4 rounded bg-cyber-dark-800 border border-cyber-gray-600">
          <h4 className="font-cyber text-white mb-2">RATE LIMITS</h4>
          <p className="text-sm text-cyber-gray-400">
            To prevent abuse, searches are limited to <strong className="text-neon-blue">10 per hour</strong> 
            per IP address. Exceeding this limit will result in temporary restrictions.
          </p>
        </div>
      </div>

      {/* Accept Button */}
      <motion.button
        onClick={onAccept}
        className="cyber-button w-full rounded-lg py-4 text-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        I ACCEPT THE TERMS
      </motion.button>

      <p className="text-center text-xs text-cyber-gray-500 mt-4">
        By clicking "I ACCEPT", you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
}

export default Disclaimers;
