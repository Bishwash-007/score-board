import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/node';
import { AppError } from '../utils/error.js';

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE ? 'DRY_RUN' : 'LIVE';

if (!arcjetKey) {
  throw new AppError('ARCJET_KEY is required in environment variables', 500);
}

export const httpArcjet = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
        }),
        slidingWindow({
          mode: arcjetMode,
          interval: '10s',
          max: 50,
        }),
      ],
    })
  : null;

export const wsArcjet = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
        }),
        slidingWindow({
          mode: arcjetMode,
          interval: '2s',
          max: 5,
        }),
      ],
    })
  : null;

export const securityMiddleware = async (req, res, next) => {
  if (!httpArcjet) {
    return next();
  }
  try {
    const decision = await httpArcjet.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ status: 'error', message: 'Too many requests' });
      }

      return res
        .status(403)
        .json({ status: 'error', message: 'Access denied' });
    }
  } catch (error) {
    throw new AppError('Service Unavailable', 503, error.message);
  }

  next();
};
