const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const os = require('os');

const execAsync = promisify(exec);

// Try multiple sherlock paths
const SHERLOCK_PATHS = [
  process.env.SHERLOCK_PATH,
  '/opt/venv/bin/sherlock',
  'sherlock',
  'sherlock-project'
].filter(Boolean);

const PLATFORMS = [
  'GitHub', 'Twitter', 'Instagram', 'Facebook', 'LinkedIn',
  'Reddit', 'Pinterest', 'TikTok', 'YouTube', 'Twitch',
  'Steam', 'Discord', 'Medium', 'DeviantArt', 'Flickr',
  'SoundCloud', 'Spotify', 'Tumblr', 'Vimeo', 'Keybase',
  'Gravatar', 'About.me', 'Patreon', 'Blogger', 'WordPress'
];

async function findSherlock() {
  for (const p of SHERLOCK_PATHS) {
    try {
      await execAsync(`${p} --version`, { timeout: 5000 });
      return p;
    } catch (e) {
      continue;
    }
  }
  return null;
}

async function searchUsername(username, searchId, io) {
  const tempDir = path.join(os.tmpdir(), `sherlock-${searchId}`);
  const outputPath = path.join(tempDir, 'results.json');
  
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    await updateSearchStatus(searchId, 'running', io);
    
    const sherlockPath = await findSherlock();
    
    if (!sherlockPath) {
      console.log('Sherlock not found, using fallback platform check');
      const results = await fallbackSearch(username, searchId, io);
      await updateSearchStatus(searchId, 'completed', io, results.length);
      return results;
    }

    const command = `${sherlockPath} "${username}" --jsonfile ${outputPath} --print-found 2>&1`;
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 300000,
      cwd: tempDir,
      env: { ...process.env, PYTHONUNBUFFERED: '1', PATH: `/opt/venv/bin:${process.env.PATH}` }
    });
    
    let results = [];
    if (fs.existsSync(outputPath)) {
      const rawData = fs.readFileSync(outputPath, 'utf8');
      results = JSON.parse(rawData);
    }
    
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
    
    if (io) {
      io.to(`search-${searchId}`).emit('search-complete', { searchId, results: processedResults });
    }
    
    await updateSearchStatus(searchId, 'completed', io, processedResults.length);
    fs.rmSync(tempDir, { recursive: true, force: true });
    return processedResults;
    
  } catch (error) {
    console.error('Sherlock search error:', error.message);
    // Fallback on error
    const results = await fallbackSearch(username, searchId, io);
    await updateSearchStatus(searchId, 'completed', io, results.length);
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    return results;
  }
}

// Fallback: check common platforms by HTTP status
async function fallbackSearch(username, searchId, io) {
  const axios = require('axios');
  const results = [];
  
  const platforms = [
    { name: 'GitHub', url: `https://github.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Twitter', url: `https://x.com/${username}`, check: (r) => r.status !== 404 && r.status !== 403 },
    { name: 'Instagram', url: `https://www.instagram.com/${username}/`, check: (r) => r.status !== 404 },
    { name: 'Reddit', url: `https://www.reddit.com/user/${username}`, check: (r) => r.status !== 404 },
    { name: 'TikTok', url: `https://www.tiktok.com/@${username}`, check: (r) => r.status !== 404 },
    { name: 'YouTube', url: `https://www.youtube.com/@${username}`, check: (r) => r.status !== 404 },
    { name: 'LinkedIn', url: `https://www.linkedin.com/in/${username}`, check: (r) => r.status !== 404 },
    { name: 'Pinterest', url: `https://www.pinterest.com/${username}/`, check: (r) => r.status !== 404 },
    { name: 'Twitch', url: `https://www.twitch.tv/${username}`, check: (r) => r.status !== 404 },
    { name: 'Steam', url: `https://steamcommunity.com/id/${username}`, check: (r) => r.status !== 404 },
    { name: 'DeviantArt', url: `https://www.deviantart.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Medium', url: `https://medium.com/@${username}`, check: (r) => r.status !== 404 },
    { name: 'Keybase', url: `https://keybase.io/${username}`, check: (r) => r.status !== 404 },
    { name: 'About.me', url: `https://about.me/${username}`, check: (r) => r.status !== 404 },
    { name: 'Patreon', url: `https://www.patreon.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Spotify', url: `https://open.spotify.com/user/${username}`, check: (r) => r.status !== 404 },
    { name: 'SoundCloud', url: `https://soundcloud.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Flickr', url: `https://www.flickr.com/people/${username}/`, check: (r) => r.status !== 404 },
    { name: 'Vimeo', url: `https://vimeo.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Blogger', url: `https://${username}.blogspot.com`, check: (r) => r.status !== 404 },
    { name: 'GitLab', url: `https://gitlab.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'HackerRank', url: `https://www.hackerrank.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'LeetCode', url: `https://leetcode.com/${username}`, check: (r) => r.status !== 404 },
    { name: 'Telegram', url: `https://t.me/${username}`, check: (r) => r.status !== 404 },
    { name: 'Gravatar', url: `https://en.gravatar.com/${username}`, check: (r) => r.status !== 404 },
  ];

  const batchSize = 5;
  for (let i = 0; i < platforms.length; i += batchSize) {
    const batch = platforms.slice(i, i + batchSize);
    const promises = batch.map(async (platform) => {
      try {
        const response = await axios.head(platform.url, {
          timeout: 5000,
          maxRedirects: 5,
          validateStatus: () => true,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        
        const found = platform.check(response);
        results.push({
          platform: platform.name,
          username: username,
          url: platform.url,
          status: found ? 'found' : 'not_found',
          metadata: { httpStatus: response.status }
        });
        
        if (io) {
          io.to(`search-${searchId}`).emit('search-progress', {
            searchId,
            currentPlatform: platform.name,
            platformsSearched: Math.min(i + batchSize, platforms.length),
            totalPlatforms: platforms.length,
            percentage: Math.round(((Math.min(i + batchSize, platforms.length)) / platforms.length) * 100)
          });
        }
      } catch (e) {
        results.push({
          platform: platform.name,
          username: username,
          url: platform.url,
          status: 'error',
          metadata: { error: e.message }
        });
      }
    });
    await Promise.all(promises);
  }

  if (io) {
    io.to(`search-${searchId}`).emit('search-complete', { searchId, results });
  }

  return results;
}

async function updateSearchStatus(searchId, status, io, resultsCount = 0) {
  const { getDatabase, run } = require('../utils/database');
  await getDatabase();
  
  run('UPDATE searches SET status = ?, completed_at = ?, results_count = ? WHERE id = ?',
    [status, new Date().toISOString(), resultsCount, searchId]
  );
  
  if (io) {
    io.to(`search-${searchId}`).emit('search-progress', { searchId, status, resultsCount });
  }
}

module.exports = { searchUsername, PLATFORMS };
