import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSearch, FaSpinner, FaInfoCircle } from 'react-icons/fa';

function UsernameSearch({ onSearch, isSearching }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && !isSearching) {
      onSearch('username', username.trim());
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded bg-neon-blue/20">
          <FaUser className="text-2xl text-neon-blue" />
        </div>
        <div>
          <h3 className="text-lg font-cyber text-white">Username Search</h3>
          <p className="text-sm text-cyber-gray-400">
            Search for usernames across 25+ social media platforms
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-cyber-gray-400 mb-2 font-mono">
            TARGET USERNAME
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to investigate..."
              className="cyber-input w-full rounded pr-12"
              disabled={isSearching}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-gray-500">
              @
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-cyber-gray-400">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <p>
            This search uses Sherlock OSINT tool to check username availability 
            across GitHub, Twitter, Instagram, Reddit, and 20+ other platforms.
          </p>
        </div>

        <button
          type="submit"
          disabled={!username.trim() || isSearching}
          className="cyber-button w-full rounded flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Initiate Username Scan</span>
            </>
          )}
        </button>
      </form>

      {/* Platform Preview */}
      <div className="mt-6 pt-4 border-t border-cyber-gray-600">
        <p className="text-xs text-cyber-gray-500 mb-3">PLATFORMS COVERED:</p>
        <div className="flex flex-wrap gap-2">
          {['GitHub', 'Twitter', 'Instagram', 'Reddit', 'LinkedIn', 'TikTok', 'YouTube', 'Twitch'].map(
            (platform) => (
              <span
                key={platform}
                className="px-2 py-1 text-xs rounded bg-cyber-gray-600/30 text-cyber-gray-400 border border-cyber-gray-600"
              >
                {platform}
              </span>
            )
          )}
          <span className="px-2 py-1 text-xs rounded bg-neon-blue/10 text-neon-blue border border-neon-blue/30">
            +17 more
          </span>
        </div>
      </div>
    </div>
  );
}

export default UsernameSearch;
