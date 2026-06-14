const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class ImageSearchService {
  constructor() {
    this.serpapiKey = process.env.SERPAPI_KEY;
    this.tineyeApiKey = process.env.TINEYE_API_KEY;
  }

  async searchByURL(imageUrl, searchId, io) {
    const results = [];
    
    // Try Google Reverse Image Search via SerpAPI
    if (this.serpapiKey) {
      try {
        const googleResults = await this.searchGoogle(imageUrl);
        results.push(...googleResults);
      } catch (error) {
        console.error('Google image search error:', error.message);
      }
    }
    
    // Try TinEye
    if (this.tineyeApiKey) {
      try {
        const tineyeResults = await this.searchTinEye(imageUrl);
        results.push(...tineyeResults);
      } catch (error) {
        console.error('TinEye search error:', error.message);
      }
    }
    
    // Mock results if no API keys
    if (results.length === 0) {
      results.push(...this.getMockResults(imageUrl));
    }
    
    // Emit progress
    if (io) {
      io.to(`search-${searchId}`).emit('image-search-complete', {
        searchId,
        results
      });
    }
    
    return results;
  }

  async searchByFile(filePath, searchId, io) {
    // For file uploads, we need to convert to a URL or use local search
    const results = [];
    
    // Mock results for demo
    results.push(...this.getMockResults('uploaded-image'));
    
    if (io) {
      io.to(`search-${searchId}`).emit('image-search-complete', {
        searchId,
        results
      });
    }
    
    return results;
  }

  async searchGoogle(imageUrl) {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_reverse_image',
        image_url: imageUrl,
        api_key: this.serpapiKey
      }
    });
    
    return (response.data.image_results || []).map(r => ({
      source: 'Google',
      url: r.link,
      title: r.title,
      thumbnail: r.thumbnail,
      confidence: r.position ? Math.max(50, 100 - (r.position * 5)) : 75,
      domain: r.source
    }));
  }

  async searchTinEye(imageUrl) {
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    
    const response = await axios.post(
      'https://api.tineye.com/rest/search/',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `BASIC ${Buffer.from(this.tineyeApiKey).toString('base64')}`
        }
      }
    );
    
    return (response.data.matches || []).map(m => ({
      source: 'TinEye',
      url: m.backlinks?.[0]?.backlink || '',
      title: m.domain,
      thumbnail: m.image_url,
      confidence: m.score * 100,
      domain: m.domain
    }));
  }

  getMockResults(imageUrl) {
    return [
      {
        source: 'Demo',
        url: '#',
        title: 'Demo result - Add API keys for real results',
        thumbnail: '',
        confidence: 85,
        domain: 'example.com'
      },
      {
        source: 'Demo',
        url: '#',
        title: 'Configure SERPAPI_KEY or TINEYE_API_KEY',
        thumbnail: '',
        confidence: 70,
        domain: 'example.com'
      }
    ];
  }
}

module.exports = new ImageSearchService();
