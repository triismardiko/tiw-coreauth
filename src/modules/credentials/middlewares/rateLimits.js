// File: src/modules/credentials/middlewares/rateLimits.js

export function createRateLimit(max, timeWindow, message) {
  return {
    config: {
      rateLimit: {
        max,
        timeWindow,
        errorResponseBuilder: () => ({
          statusCode: 429,
          error: 'Too Many Requests',
          message
        })
      }
    }
  };
}

// Preset exports
export const loginRateLimit = createRateLimit(5, '1 minute', 'Login rate limit exceeded. Please try again in 1 minute.');
export const registerRateLimit = createRateLimit(5, '5 minutes', 'Too many registrations. Try again in 5 minutes.');
export const twoFARateLimit = createRateLimit(10, '10 minutes', 'Too many 2FA attempts. Try again in 10 minutes.');
