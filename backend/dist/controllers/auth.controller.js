"use strict";
// import { Request, Response } from 'express';
// import User from '../models/User';
// import jwt from 'jsonwebtoken';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    /**
     * Sign up new user
     */
    static async signup(req, res) {
        try {
            const { email, password, name } = req.body;
            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }
            // Check if user exists
            const existingUser = await User_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            // Create user
            const user = await User_1.default.create({
                email,
                password,
                name
            });
            // Generate JWT - FIX: Add type assertion for JWT_SECRET
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        }
        catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Login user
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validation
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            // Find user
            const user = await User_1.default.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Generate JWT - FIX: Add type assertion for JWT_SECRET
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Get current user
     */
    static async getMe(req, res) {
        try {
            const user = await User_1.default.findById(req.user._id).select('-password');
            res.json({
                success: true,
                user
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
