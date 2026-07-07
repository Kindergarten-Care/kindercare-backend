import ApiResponse from '../utils/ApiResponse.js';
import httpStatus from 'http-status';

const DEFAULT_TIMEOUT_MS = parseInt(process.env.SERVER_TIMEOUT_MS || '30000', 10);

/**
 * Hard per-request timeout. If a handler doesn't respond within `timeoutMs`,
 * the connection is destroyed with HTTP 503 (Service Unavailable) — this
 * prevents the Node process from being held hostage by a slow MySQL query
 * or a downstream call that never resolves, which historically caused the
 * upstream Nginx proxy to surface 502 Bad Gateway.
 *
 * Implementation note: we hijack the socket so the response writer can still
 * flush a structured ApiResponse, then abort the request. If headers have
 * already been sent (which shouldn't happen if the handler respects the
 * timeout), we just destroy the socket.
 */
export const serverTimeout = (timeoutMs = DEFAULT_TIMEOUT_MS) => {
  return (req, res, next) => {
    res.setTimeout(timeoutMs, () => {
      if (res.headersSent) {
        try { req.socket.destroy(); } catch (_) { /* ignore */ }
        return;
      }

      const payload = new ApiResponse(
        httpStatus.SERVICE_UNAVAILABLE,
        null,
        `Yêu cầu vượt quá thời gian xử lý (${timeoutMs}ms)`
      );

      try {
        res.status(httpStatus.SERVICE_UNAVAILABLE).json(payload);
      } catch (_) {
        try { req.socket.destroy(); } catch (__) { /* ignore */ }
      }
    });
    next();
  };
};