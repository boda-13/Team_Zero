// ========================================
// LOGGER MIDDLEWARE
// ========================================

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logStream = fs.createWriteStream(
    path.join(logsDir, `access-${new Date().toISOString().split('T')[0]}.log`),
    { flags: 'a' }
);

const logger = (req, res, next) => {
    const start = Date.now();
    
    // Log on response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent') || 'Unknown'
        };
        
        const logLine = JSON.stringify(log) + '\n';
        logStream.write(logLine);
        
        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `${log.method} ${log.url} - ${log.status} - ${log.duration}`
            );
        }
    });
    
    next();
};

module.exports = logger;