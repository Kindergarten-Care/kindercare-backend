/**
 * Simple In-memory Cache for QR Tokens to prevent Replay Attacks
 * Stores JWT 'jti' (JWT ID) to ensure a QR code is only used once.
 */

class QRCache {
  constructor() {
    this.cache = new Map();
    // Cleanup expired tokens every minute
    setInterval(() => this.cleanup(), 60 * 1000).unref();
  }

  /**
   * Check if a token ID has been used
   * @param {string} jti - JWT ID
   * @returns {boolean} True if token is already in cache
   */
  has(jti) {
    if (this.cache.has(jti)) {
      const expiresAt = this.cache.get(jti);
      if (Date.now() > expiresAt) {
        this.cache.delete(jti);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Add a token ID to the cache
   * @param {string} jti - JWT ID
   * @param {number} exp - Expiration timestamp in seconds (from JWT)
   */
  add(jti, exp) {
    // exp is in seconds, convert to milliseconds
    this.cache.set(jti, exp * 1000);
  }

  cleanup() {
    const now = Date.now();
    for (const [jti, expiresAt] of this.cache.entries()) {
      if (now > expiresAt) {
        this.cache.delete(jti);
      }
    }
  }
}

export const qrCache = new QRCache();
