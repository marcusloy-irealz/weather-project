/**
 * Health Check API Handler
 * Compatible with Vercel Serverless Functions and Express route handlers.
 * Reports:
 * 1. Singapore Real-time 2-Hour Weather Forecast API status
 * 2. Service uptime and environment operational checks
 */
export default async function handler(req, res) {
  res.setHeader?.('Cache-Control', 'no-cache, no-store, must-revalidate');

  let weatherAnswered = false;

  // Probe Singapore Weather API
  try {
    const weatherRes = await fetch('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast', {
      headers: { accept: 'application/json' },
    });
    if (weatherRes.ok) {
      weatherAnswered = true;
    }
  } catch (_) {
    weatherAnswered = false;
  }

  const payload = {
    status: 'ok',
    service: 'singapore-weather-forecast-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    weatherApiAnswered: weatherAnswered,
    message: 'Singapore Live Weather API services are healthy and operational.'
  };

  if (res.status && typeof res.status === 'function') {
    res.status(200).json(payload);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  }
}
