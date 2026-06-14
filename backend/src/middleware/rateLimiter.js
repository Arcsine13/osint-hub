const { getDatabase, queryOne, run } = require('../utils/database');

class RateLimiter {
  constructor() {
    this.maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 10;
    this.windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000;
  }

  async checkLimit(ipAddress) {
    const db = await getDatabase();
    const windowStart = new Date(Date.now() - this.windowMs).toISOString();
    
    const result = queryOne(
      'SELECT COUNT(*) as count FROM rate_limits WHERE ip_address = ? AND created_at > ?',
      [ipAddress, windowStart]
    );
    
    return {
      allowed: (result?.count || 0) < this.maxRequests,
      remaining: Math.max(0, this.maxRequests - (result?.count || 0)),
      resetAt: new Date(Date.now() + this.windowMs).toISOString()
    };
  }

  async recordRequest(ipAddress, searchType) {
    await getDatabase();
    run(
      'INSERT INTO rate_limits (ip_address, search_type) VALUES (?, ?)',
      [ipAddress, searchType]
    );
  }
}

module.exports = { RateLimiter };
