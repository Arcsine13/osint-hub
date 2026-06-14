import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSearch, FaSpinner, FaInfoCircle, FaDatabase } from 'react-icons/fa';

function EmailSearch({ onSearch, isSearching }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && !isSearching) {
      onSearch('email', email.trim());
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded bg-neon-purple/20">
          <FaEnvelope className="text-2xl text-neon-purple" />
        </div>
        <div>
          <h3 className="text-lg font-cyber text-white">Email Lookup</h3>
          <p className="text-sm text-cyber-gray-400">
            Find accounts and public records associated with an email address
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-cyber-gray-400 mb-2 font-mono">
            TARGET EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investigate@example.com"
            className="cyber-input w-full rounded"
            disabled={isSearching}
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-cyber-gray-400">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <p>
            Email lookup searches public databases and analyzes email patterns to find 
            associated accounts, social profiles, and public records.
          </p>
        </div>

        <button
          type="submit"
          disabled={!email.trim() || !isValidEmail(email) || isSearching}
          className="cyber-button w-full rounded flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Looking up...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Initiate Email Lookup</span>
            </>
          )}
        </button>
      </form>

      {/* Data Sources */}
      <div className="mt-6 pt-4 border-t border-cyber-gray-600">
        <p className="text-xs text-cyber-gray-500 mb-3">DATA SOURCES:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'PeopleDataLabs', icon: FaDatabase },
            { name: 'Pattern Analysis', icon: FaEnvelope },
            { name: 'Social Profiles', icon: FaDatabase },
            { name: 'Public Records', icon: FaDatabase },
          ].map((source) => (
            <div
              key={source.name}
              className="flex items-center gap-2 px-3 py-2 rounded bg-cyber-gray-600/20 border border-cyber-gray-600"
            >
              <source.icon className="text-xs text-neon-purple" />
              <span className="text-xs text-cyber-gray-400">{source.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmailSearch;
