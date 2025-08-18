const rateLimit = require('express-rate-limit');

module.exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: 'Too many requests from this IP, please try again later.' }
});

module.exports.generalLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 100, 
    message: { error: 'Too many requests, please slow down.' },
});
