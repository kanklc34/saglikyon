// ============================================
// SağlıkYön - Rate limit yardımcıları
// Tarayıcı tarafında istek yoğunluğunu kontrol eder
// ============================================

export const RATE_LIMIT_CONFIG = {
  maxRequests: 8,
  windowMs: 60 * 1000
};

export function sanitizeTimestamps(rawTimestamps, now = Date.now(), config = RATE_LIMIT_CONFIG) {
  if (!Array.isArray(rawTimestamps)) return [];

  return rawTimestamps
    .map(value => Number(value))
    .filter(value => Number.isFinite(value) && value > 0 && now - value < config.windowMs)
    .sort((left, right) => left - right);
}

export function getRateLimitState(rawTimestamps, now = Date.now(), config = RATE_LIMIT_CONFIG) {
  const timestamps = sanitizeTimestamps(rawTimestamps, now, config);
  const remaining = Math.max(0, config.maxRequests - timestamps.length);
  const oldestRequest = timestamps[0] || null;
  const resetInMs = oldestRequest
    ? Math.max(0, config.windowMs - (now - oldestRequest))
    : 0;

  return {
    timestamps,
    remaining,
    limit: config.maxRequests,
    isLimited: remaining === 0,
    resetInMs
  };
}

export function recordRateLimitHit(rawTimestamps, now = Date.now(), config = RATE_LIMIT_CONFIG) {
  const timestamps = sanitizeTimestamps(rawTimestamps, now, config);
  timestamps.push(now);

  return getRateLimitState(timestamps, now, config);
}

export function formatCooldown(resetInMs) {
  const totalSeconds = Math.max(0, Math.ceil(resetInMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sn`;
  }

  if (seconds === 0) {
    return `${minutes} dk`;
  }

  return `${minutes} dk ${seconds} sn`;
}
