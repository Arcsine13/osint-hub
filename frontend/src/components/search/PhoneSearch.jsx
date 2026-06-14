import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaSearch, FaSpinner, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

function PhoneSearch({ onSearch, isSearching }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.trim() && !isSearching) {
      onSearch('phone', phone.trim());
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded bg-neon-green/20">
          <FaPhone className="text-2xl text-neon-green" />
        </div>
        <div>
          <h3 className="text-lg font-cyber text-white">Phone Number Lookup</h3>
          <p className="text-sm text-cyber-gray-400">
            Find accounts and public info tied to a phone number
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-cyber-gray-400 mb-2 font-mono">
            TARGET PHONE NUMBER
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="cyber-input w-full rounded pl-12"
              disabled={isSearching}
            />
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-gray-500" />
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-cyber-gray-400">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <p>
            Phone lookup analyzes carrier data, area codes, and public records to find 
            associated accounts and location information.
          </p>
        </div>

        <button
          type="submit"
          disabled={!phone.trim() || isSearching}
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
              <span>Initiate Phone Lookup</span>
            </>
          )}
        </button>
      </form>

      {/* Location Preview */}
      <div className="mt-6 pt-4 border-t border-cyber-gray-600">
        <p className="text-xs text-cyber-gray-500 mb-3">ANALYSIS INCLUDES:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Carrier Detection', icon: FaPhone },
            { name: 'Region Lookup', icon: FaMapMarkerAlt },
            { name: 'Account Matching', icon: FaSearch },
            { name: 'Public Records', icon: FaInfoCircle },
          ].map((feature) => (
            <div
              key={feature.name}
              className="flex items-center gap-2 px-3 py-2 rounded bg-cyber-gray-600/20 border border-cyber-gray-600"
            >
              <feature.icon className="text-xs text-neon-green" />
              <span className="text-xs text-cyber-gray-400">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhoneSearch;
