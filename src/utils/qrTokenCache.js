// In-memory store for used QR token JTIs to prevent replay attacks.
// Token TTL is 60 seconds, so memory usage stays negligible.
const usedJtis = new Map(); // jti -> expiry (unix seconds)

export const isJtiUsed = (jti) => usedJtis.has(jti);

export const markJtiUsed = (jti, expiry) => {
  usedJtis.set(jti, expiry);
};

// Purge expired entries every 5 minutes
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const [jti, exp] of usedJtis) {
    if (exp < now) usedJtis.delete(jti);
  }
}, 5 * 60 * 1000);
