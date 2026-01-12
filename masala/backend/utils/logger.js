/**
 * Logger Utility
 * Console-based logging for serverless environments
 */

const fs = require('fs');
const path = require('path');

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';

let logFile = null;

// Only create logs directory in non-serverless environments
if (!isServerless) {
    const logDir = path.join(__dirname, '../logs');

    // Create logs directory if it doesn't exist
    try {
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        logFile = path.join(logDir, 'error.log');
    } catch (err) {
        console.warn('Could not create logs directory:', err.message);
    }
}

/**
 * Log error to console (and optionally to file in development)
 */
const logError = (error) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${error.stack || error.message}`;

    // Always log to console
    console.error(logMessage);

    // Also write to file if available (local development only)
    if (logFile) {
        fs.appendFile(logFile, logMessage + '\n\n', (err) => {
            if (err) console.error('Failed to write to log file:', err);
        });
    }
};

module.exports = { logError };

