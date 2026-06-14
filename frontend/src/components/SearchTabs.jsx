import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaImage, FaSearch, FaSpinner } from 'react-icons/fa';
import UsernameSearch from './search/UsernameSearch';
import EmailSearch from './search/EmailSearch';
import PhoneSearch from './search/PhoneSearch';
import ImageSearch from './search/ImageSearch';
import ProgressBar from './ProgressBar';

const tabs = [
  { id: 'username', label: 'Username', icon: FaUser, color: 'neon-blue' },
  { id: 'email', label: 'Email', icon: FaEnvelope, color: 'neon-purple' },
  { id: 'phone', label: 'Phone', icon: FaPhone, color: 'neon-green' },
  { id: 'image', label: 'Image', icon: FaImage, color: 'neon-pink' },
];

function SearchTabs({ onSearch, isSearching, searchProgress, currentSearchId }) {
  const [activeTab, setActiveTab] = useState('username');

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'username':
        return <UsernameSearch onSearch={onSearch} isSearching={isSearching} />;
      case 'email':
        return <EmailSearch onSearch={onSearch} isSearching={isSearching} />;
      case 'phone':
        return <PhoneSearch onSearch={onSearch} isSearching={isSearching} />;
      case 'image':
        return <ImageSearch onSearch={onSearch} isSearching={isSearching} />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cyber-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className={`text-${tab.color}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Form Container */}
      <div className="cyber-card rounded-lg p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSearchForm()}
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        {isSearching && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <ProgressBar progress={searchProgress} />
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="cyber-card rounded p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue">25+</div>
          <div className="text-xs text-cyber-gray-400">Platforms</div>
        </div>
        <div className="cyber-card rounded p-4 text-center">
          <div className="text-2xl font-bold text-neon-purple">Real-time</div>
          <div className="text-xs text-cyber-gray-400">Updates</div>
        </div>
        <div className="cyber-card rounded p-4 text-center">
          <div className="text-2xl font-bold text-neon-green">Secure</div>
          <div className="text-xs text-cyber-gray-400">Connection</div>
        </div>
        <div className="cyber-card rounded p-4 text-center">
          <div className="text-2xl font-bold text-neon-pink">AES-256</div>
          <div className="text-xs text-cyber-gray-400">Encryption</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SearchTabs;
