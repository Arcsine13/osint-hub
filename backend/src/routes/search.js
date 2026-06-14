const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDatabase, queryOne, run } = require('../utils/database');
const { searchUsername } = require('../services/sherlockService');
const imageSearchService = require('../services/imageSearchService');
const publicRecordsService = require('../services/publicRecordsService');
const { RateLimiter } = require('../middleware/rateLimiter');

const rateLimiter = new RateLimiter();

// Username search
router.post('/username', async (req, res) => {
  try {
    const { username } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    await getDatabase();

    // Check rate limit
    const limitCheck = await rateLimiter.checkLimit(ipAddress);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        remaining: limitCheck.remaining,
        resetAt: limitCheck.resetAt
      });
    }

    // Create search record
    const searchId = uuidv4();
    run(
      'INSERT INTO searches (id, type, query, status, ip_address) VALUES (?, ?, ?, ?, ?)',
      [searchId, 'username', username, 'pending', ipAddress]
    );

    // Record rate limit
    await rateLimiter.recordRequest(ipAddress, 'username');

    // Start search in background
    searchUsername(username, searchId, req.app.get('io')).catch(err => {
      console.error('Search failed:', err);
    });

    res.json({
      searchId,
      status: 'pending',
      message: 'Search started',
      limitInfo: {
        remaining: limitCheck.remaining - 1,
        resetAt: limitCheck.resetAt
      }
    });

  } catch (error) {
    console.error('Username search error:', error);
    res.status(500).json({ error: 'Search failed to start' });
  }
});

// Email lookup
router.post('/email', async (req, res) => {
  try {
    const { email } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await getDatabase();

    // Check rate limit
    const limitCheck = await rateLimiter.checkLimit(ipAddress);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        remaining: limitCheck.remaining,
        resetAt: limitCheck.resetAt
      });
    }

    // Create search record
    const searchId = uuidv4();
    run(
      'INSERT INTO searches (id, type, query, status, ip_address) VALUES (?, ?, ?, ?, ?)',
      [searchId, 'email', email, 'running', ipAddress]
    );

    // Record rate limit
    await rateLimiter.recordRequest(ipAddress, 'email');

    // Perform search
    const results = await publicRecordsService.searchByEmail(email, searchId, req.app.get('io'));

    // Update status
    run(
      'UPDATE searches SET status = ?, completed_at = ?, results_count = ? WHERE id = ?',
      ['completed', new Date().toISOString(), results.accounts.length, searchId]
    );

    res.json({
      searchId,
      status: 'completed',
      results
    });

  } catch (error) {
    console.error('Email lookup error:', error);
    res.status(500).json({ error: 'Email lookup failed' });
  }
});

// Phone lookup
router.post('/phone', async (req, res) => {
  try {
    const { phone } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    await getDatabase();

    // Check rate limit
    const limitCheck = await rateLimiter.checkLimit(ipAddress);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        remaining: limitCheck.remaining,
        resetAt: limitCheck.resetAt
      });
    }

    // Create search record
    const searchId = uuidv4();
    run(
      'INSERT INTO searches (id, type, query, status, ip_address) VALUES (?, ?, ?, ?, ?)',
      [searchId, 'phone', phone, 'running', ipAddress]
    );

    // Record rate limit
    await rateLimiter.recordRequest(ipAddress, 'phone');

    // Perform search
    const results = await publicRecordsService.searchByPhone(phone, searchId, req.app.get('io'));

    // Update status
    run(
      'UPDATE searches SET status = ?, completed_at = ?, results_count = ? WHERE id = ?',
      ['completed', new Date().toISOString(), results.possibleNames.length + results.publicRecords.length, searchId]
    );

    res.json({
      searchId,
      status: 'completed',
      results
    });

  } catch (error) {
    console.error('Phone lookup error:', error);
    res.status(500).json({ error: 'Phone lookup failed' });
  }
});

// Image search
router.post('/image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    await getDatabase();

    // Check rate limit
    const limitCheck = await rateLimiter.checkLimit(ipAddress);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        remaining: limitCheck.remaining,
        resetAt: limitCheck.resetAt
      });
    }

    // Create search record
    const searchId = uuidv4();
    run(
      'INSERT INTO searches (id, type, query, status, ip_address) VALUES (?, ?, ?, ?, ?)',
      [searchId, 'image', imageUrl, 'running', ipAddress]
    );

    // Record rate limit
    await rateLimiter.recordRequest(ipAddress, 'image');

    // Perform search
    const results = await imageSearchService.searchByURL(imageUrl, searchId, req.app.get('io'));

    // Update status
    run(
      'UPDATE searches SET status = ?, completed_at = ?, results_count = ? WHERE id = ?',
      ['completed', new Date().toISOString(), results.length, searchId]
    );

    res.json({
      searchId,
      status: 'completed',
      results
    });

  } catch (error) {
    console.error('Image search error:', error);
    res.status(500).json({ error: 'Image search failed' });
  }
});

// Get search status
router.get('/status/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;
    await getDatabase();
    
    const search = queryOne('SELECT * FROM searches WHERE id = ?', [searchId]);
    
    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json(search);

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;
