import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export function useSearch(socket) {
  const [searchResults, setSearchResults] = useState(null);
  const [searchProgress, setSearchProgress] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchId, setCurrentSearchId] = useState(null);

  // Listen for WebSocket updates
  useEffect(() => {
    if (!socket || !currentSearchId) return;

    socket.emit('join-search', currentSearchId);

    const handleProgress = (data) => {
      setSearchProgress(data);
    };

    const handleComplete = (data) => {
      setSearchResults(data.results);
      setIsSearching(false);
      toast.success(`Search complete! Found ${data.results?.length || 0} results`);
    };

    const handleError = (data) => {
      setIsSearching(false);
      toast.error(data.message || 'Search failed');
    };

    socket.on('search-progress', handleProgress);
    socket.on('search-complete', handleComplete);
    socket.on('search-error', handleError);

    return () => {
      socket.off('search-progress', handleProgress);
      socket.off('search-complete', handleComplete);
      socket.off('search-error', handleError);
    };
  }, [socket, currentSearchId]);

  const performSearch = useCallback(async (type, query) => {
    setIsSearching(true);
    setSearchResults(null);
    setSearchProgress({ percentage: 0, platformsSearched: 0, totalPlatforms: 25 });

    try {
      let response;
      
      switch (type) {
        case 'username':
          response = await axios.post(`${API_BASE}/search/username`, { username: query });
          break;
        case 'email':
          response = await axios.post(`${API_BASE}/search/email`, { email: query });
          break;
        case 'phone':
          response = await axios.post(`${API_BASE}/search/phone`, { phone: query });
          break;
        case 'image':
          response = await axios.post(`${API_BASE}/search/image`, { imageUrl: query });
          break;
        default:
          throw new Error('Invalid search type');
      }

      const { searchId, status, results } = response.data;
      
      setCurrentSearchId(searchId);

      // If results are returned directly (non-Sherlock searches)
      if (status === 'completed' && results) {
        setSearchResults(Array.isArray(results) ? results : [results]);
        setIsSearching(false);
        toast.success(`Search complete! Found results`);
        return;
      }

      // For Sherlock searches, poll for status
      if (status === 'pending' || status === 'running') {
        pollSearchStatus(searchId);
      }

    } catch (error) {
      setIsSearching(false);
      const message = error.response?.data?.error || 'Search failed to start';
      toast.error(message);
      console.error('Search error:', error);
    }
  }, []);

  const pollSearchStatus = async (searchId) => {
    const maxAttempts = 60; // 5 minutes with 5s intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`${API_BASE}/search/status/${searchId}`);
        const { status, results_count, searched_platforms, total_platforms } = response.data;

        setSearchProgress({
          percentage: total_platforms ? (searched_platforms / total_platforms) * 100 : 0,
          platformsSearched: searched_platforms || 0,
          totalPlatforms: total_platforms || 25,
          status,
        });

        if (status === 'completed') {
          // Fetch final results
          const resultsResponse = await axios.get(`${API_BASE}/results/${searchId}`);
          setSearchResults(resultsResponse.data.results);
          setIsSearching(false);
          toast.success(`Search complete! Found ${results_count} results`);
          return;
        }

        if (status === 'failed') {
          setIsSearching(false);
          toast.error('Search failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setIsSearching(false);
          toast.error('Search timed out');
        }

      } catch (error) {
        console.error('Poll error:', error);
        setIsSearching(false);
        toast.error('Failed to get search status');
      }
    };

    poll();
  };

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setSearchProgress(null);
    setCurrentSearchId(null);
  }, []);

  return {
    searchResults,
    searchProgress,
    isSearching,
    currentSearchId,
    performSearch,
    clearResults,
  };
}
