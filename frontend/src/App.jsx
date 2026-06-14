import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import SearchTabs from './components/SearchTabs';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingOverlay from './components/LoadingOverlay';
import Disclaimers from './components/Disclaimers';
import { useSocket } from './hooks/useSocket';
import { useSearch } from './hooks/useSearch';

function App() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { socket, connected } = useSocket();
  const { 
    searchResults, 
    searchProgress, 
    isSearching, 
    currentSearchId,
    performSearch,
    clearResults 
  } = useSearch(socket);

  useEffect(() => {
    const termsAccepted = localStorage.getItem('osint-hub-terms-accepted');
    if (termsAccepted) {
      setAcceptedTerms(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('osint-hub-terms-accepted', 'true');
    setAcceptedTerms(true);
  };

  if (!acceptedTerms) {
    return (
      <div className="min-h-screen grid-bg hex-pattern flex items-center justify-center p-4">
        <Disclaimers onAccept={handleAcceptTerms} />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg hex-pattern">
      {/* Animated scan line */}
      <div className="scan-line fixed top-0 left-0 right-0 z-50 pointer-events-none" />
      
      <Header connected={connected} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SearchTabs 
          onSearch={performSearch} 
          isSearching={isSearching}
          searchProgress={searchProgress}
          currentSearchId={currentSearchId}
        />
        
        <ResultsDashboard 
          results={searchResults} 
          isSearching={isSearching}
          onClear={clearResults}
        />
      </main>

      {isSearching && <LoadingOverlay progress={searchProgress} />}
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#12121a',
            color: '#e0e0e0',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          },
        }}
      />
      
      <footer className="text-center py-6 text-cyber-gray-400 text-sm border-t border-cyber-gray-600">
        <p>OSINT Hub v1.0 | For authorized security research only</p>
        <p className="mt-1">All searches are logged and monitored</p>
      </footer>
    </div>
  );
}

export default App;
