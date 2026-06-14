const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const os = require('os');

const execAsync = promisify(exec);

const SHERLOCK_PATH = process.env.SHERLOCK_PATH || 'sherlock';

// List of supported platforms for reference
const PLATFORMS = [
  'GitHub', 'Twitter', 'Instagram', 'Facebook', 'LinkedIn',
  'Reddit', 'Pinterest', 'TikTok', 'YouTube', 'Twitch',
  'Steam', 'Discord', 'Medium', 'DeviantArt', 'Flickr',
  'SoundCloud', 'Spotify', 'Tumblr', 'Vimeo', 'Keybase',
  'Gravatar', 'About.me', 'Patreon', 'Blogger', 'WordPress'
];

async function searchUsername(username, searchId, io) {
  const tempDir = path.join(os.tmpdir(), `sherlock-${searchId}`);
  const outputPath = path.join(tempDir, 'results.json');
  
  try {
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Update status
    await updateSearchStatus(searchId, 'running', io);
    
    // Run Sherlock
    const command = `${SHERLOCK_PATH} "${username}" --jsonfile ${outputPath} --print-found 2>&1`;
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 300000, // 5 minutes
      cwd: tempDir,
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });
    
    // Parse results
    let results = [];
    if (fs.existsSync(outputPath)) {
      const rawData = fs.readFileSync(outputPath, 'utf8');
      results = JSON.parse(rawData);
    }
    
    // Process and return results
    const processedResults = results.map(r => ({
      platform: r.name || 'Unknown',
      username: username,
      url: r.url_user || r.url,
      status: r.status === 'Claimed' ? 'found' : 'not_found',
      metadata: {
        httpStatus: r.http_status,
        responseTime: r.response_time
      }
    }));
    
    // Emit progress updates
    if (io) {
      io.to(`search-${searchId}`).emit('search-complete', {
        searchId,
        results: processedResults
      });
    }
    
    await updateSearchStatus(searchId, 'completed', io, processedResults.length);
    
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    return processedResults;
    
  } catch (error) {
    console.error('Sherlock search error:', error);
    await updateSearchStatus(searchId, 'failed', io);
    
    // Cleanup on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    throw error;
  }
}

async function updateSearchStatus(searchId, status, io, resultsCount = 0) {
  const { getDatabase, run } = require('../utils/database');
  await getDatabase();
  
  const updates = { status };
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
    updates.results_count = resultsCount;
  }
  
  run('UPDATE searches SET status = ?, completed_at = ?, results_count = ? WHERE id = ?',
    [status, updates.completed_at || null, updates.results_count || 0, searchId]
  );
  
  // Emit progress via WebSocket
  if (io) {
    io.to(`search-${searchId}`).emit('search-progress', {
      searchId,
      status,
      resultsCount
    });
  }
}

module.exports = { searchUsername, PLATFORMS };
