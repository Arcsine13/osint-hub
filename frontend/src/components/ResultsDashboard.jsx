import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFilter, FaSort, FaDownload, FaCopy, FaExternalLinkAlt,
  FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaTrash,
  FaFileCode, FaFileAlt, FaGlobe, FaUser, FaEnvelope, FaPhone, FaImage
} from 'react-icons/fa';
import toast from 'react-hot-toast';

function ResultsDashboard({ results, isSearching, onClear }) {
  const [sortBy, setSortBy] = useState('platform');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getSearchTypeIcon = (type) => {
    switch (type) {
      case 'username': return FaUser;
      case 'email': return FaEnvelope;
      case 'phone': return FaPhone;
      case 'image': return FaImage;
      default: return FaGlobe;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'found': return <FaCheckCircle className="text-neon-green" />;
      case 'not_found': return <FaTimesCircle className="text-red-500" />;
      default: return <FaQuestionCircle className="text-neon-yellow" />;
    }
  };

  const filteredResults = useMemo(() => {
    if (!results) return [];
    
    let items = Array.isArray(results) ? results : [];
    
    // Apply filter
    if (filterStatus !== 'all') {
      items = items.filter(r => r.status === filterStatus);
    }
    
    // Apply sort
    items.sort((a, b) => {
      switch (sortBy) {
        case 'platform':
          return a.platform.localeCompare(b.platform);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    return items;
  }, [results, sortBy, filterStatus]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportResults = (format) => {
    if (!results || results.length === 0) {
      toast.error('No results to export');
      return;
    }

    let content, filename, type;
    
    if (format === 'json') {
      content = JSON.stringify(results, null, 2);
      filename = `osint-results-${Date.now()}.json`;
      type = 'application/json';
    } else {
      const headers = ['Platform', 'Username', 'URL', 'Status'];
      const rows = results.map(r => [r.platform, r.username, r.url, r.status]);
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = `osint-results-${Date.now()}.csv`;
      type = 'text/csv';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  if (!results || results.length === 0) {
    return (
      <motion.div
        className="cyber-card rounded-lg p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FaGlobe className="text-6xl text-cyber-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-cyber text-cyber-gray-400 mb-2">No Results Yet</h3>
        <p className="text-cyber-gray-500">
          {isSearching 
            ? 'Search in progress... Results will appear here.'
            : 'Enter a search query above to begin investigation.'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cyber-card rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-cyber text-white">
            Search Results
            <span className="ml-2 text-neon-blue">({filteredResults.length})</span>
          </h3>
          <p className="text-sm text-cyber-gray-400">
            Found across {filteredResults.length} platforms
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded border ${
              showFilters 
                ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                : 'border-cyber-gray-600 text-cyber-gray-400 hover:border-neon-blue'
            }`}
          >
            <FaFilter />
          </button>

          {/* Export Buttons */}
          <button
            onClick={() => exportResults('json')}
            className="p-2 rounded border border-cyber-gray-600 text-cyber-gray-400 hover:border-neon-purple hover:text-neon-purple"
            title="Export as JSON"
          >
            <FaFileCode />
          </button>
          <button
            onClick={() => exportResults('csv')}
            className="p-2 rounded border border-cyber-gray-600 text-cyber-gray-400 hover:border-neon-green hover:text-neon-green"
            title="Export as CSV"
          >
            <FaFileAlt />
          </button>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="p-2 rounded border border-cyber-gray-600 text-cyber-gray-400 hover:border-red-500 hover:text-red-500"
            title="Clear results"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded bg-cyber-dark-800 border border-cyber-gray-600"
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs text-cyber-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="cyber-input rounded text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="found">Found</option>
                  <option value="not_found">Not Found</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-cyber-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cyber-input rounded text-sm"
                >
                  <option value="platform">Platform Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredResults.map((result, index) => (
            <motion.div
              key={`${result.platform}-${index}`}
              className="result-card cyber-card rounded p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-cyber text-white">{result.platform}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  result.status === 'found' 
                    ? 'bg-neon-green/20 text-neon-green' 
                    : 'bg-cyber-gray-600/30 text-cyber-gray-400'
                }`}>
                  {result.status === 'found' ? 'FOUND' : 'NOT FOUND'}
                </span>
              </div>

              {result.url && (
                <div className="mb-3">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neon-blue hover:underline text-sm"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    <span className="truncate">{result.url}</span>
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(result.url || result.platform)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-cyber-gray-600/20 text-cyber-gray-400 hover:bg-cyber-gray-600/40"
                >
                  <FaCopy /> Copy
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ResultsDashboard;
