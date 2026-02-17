
import app from '../src/app.js';

// Vercel Serverless Function Handler
export default function handler(req, res) {
    // Vercel handles the request/response lifecycle
    return app(req, res);
}
