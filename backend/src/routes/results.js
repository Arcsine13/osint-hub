const express = require('express');
const router = express.Router();
const { getDatabase, queryAll, queryOne, run } = require('../utils/database');

// Get results for a search
router.get('/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;
    await getDatabase();
    
    const search = queryOne('SELECT * FROM searches WHERE id = ?', [searchId]);
    
    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    const results = queryAll('SELECT * FROM results WHERE search_id = ?', [searchId]);

    res.json({
      search,
      results: results.map(r => ({
        ...r,
        metadata: r.metadata ? JSON.parse(r.metadata) : null
      }))
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Get recent searches
router.get('/', async (req, res) => {
  try {
    await getDatabase();
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    
    const searches = queryAll(
      'SELECT * FROM searches ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    res.json({ searches });

  } catch (error) {
    console.error('Get searches error:', error);
    res.status(500).json({ error: 'Failed to get searches' });
  }
});

// Delete a search and its results
router.delete('/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;
    await getDatabase();
    
    run('DELETE FROM results WHERE search_id = ?', [searchId]);
    run('DELETE FROM searches WHERE id = ?', [searchId]);

    res.json({ success: true });

  } catch (error) {
    console.error('Delete search error:', error);
    res.status(500).json({ error: 'Failed to delete search' });
  }
});

// Export results as CSV
router.get('/:searchId/export/csv', async (req, res) => {
  try {
    const { searchId } = req.params;
    await getDatabase();
    
    const search = queryOne('SELECT * FROM searches WHERE id = ?', [searchId]);
    
    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    const results = queryAll('SELECT * FROM results WHERE search_id = ?', [searchId]);

    // Build CSV
    const headers = ['Platform', 'Username', 'URL', 'Status', 'HTTP Status'];
    const rows = results.map(r => [
      r.platform,
      r.username,
      r.url,
      r.status,
      r.metadata ? JSON.parse(r.metadata).httpStatus : ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="osint-results-${searchId}.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

// Export results as JSON
router.get('/:searchId/export/json', async (req, res) => {
  try {
    const { searchId } = req.params;
    await getDatabase();
    
    const search = queryOne('SELECT * FROM searches WHERE id = ?', [searchId]);
    
    if (!search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    const results = queryAll('SELECT * FROM results WHERE search_id = ?', [searchId]);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="osint-results-${searchId}.json"`);
    res.json({
      search,
      results: results.map(r => ({
        ...r,
        metadata: r.metadata ? JSON.parse(r.metadata) : null
      }))
    });

  } catch (error) {
    console.error('Export JSON error:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

module.exports = router;
