"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: 'Validation failed', errors });
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate entry' });
    }
    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
