/**
 * Logger Utility
 * Simple file-based logging
 */

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'error.log');

/**
 * Log error to file
 */
const logError = (error) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${error.stack || error.message}\n\n`;

    fs.appendFile(logFile, logMessage, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};

module.exports = { logError };
