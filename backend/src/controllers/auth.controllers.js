const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt.js');
const User = require('../models/User.js');
const Token = require('../models/Token.js');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/email.js');

// ---------------- SIGNUP ----------------
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- LOGIN ----------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = jwt.signAccessToken(user._id, user.role);
        const refreshToken = jwt.signRefreshToken(user._id);

        // Save refresh token in DB
        await Token.create({ user: user._id, token: refreshToken, kind: 'refresh', expiresAt: new Date(Date.now() + 7*24*60*60*1000) });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- REFRESH TOKEN ----------------
const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ error: 'No refresh token' });

        const payload = jwt.verifyRefresh(token);
        const dbToken = await Token.findOne({ user: payload.id, token, kind: 'refresh' });
        if (!dbToken) return res.status(401).json({ error: 'Invalid refresh token' });

        const accessToken = jwt.signAccessToken(payload.id, payload.role);
        res.json({ accessToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

// ---------------- LOGOUT ----------------
const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) await Token.deleteOne({ token, kind: 'refresh' });
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- FORGOT PASSWORD ----------------
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        await Token.create({
            user: user._id,
            token: resetToken,
            kind: 'reset',
            expiresAt: new Date(Date.now() + 3600000) // 1 hour
        });

        await sendResetEmail(user.email, resetToken);
        res.json({ message: 'Reset email sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------- RESET PASSWORD ----------------
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const dbToken = await Token.findOne({ token, kind: 'reset', expiresAt: { $gt: Date.now() } });
        if (!dbToken) return res.status(400).json({ error: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(dbToken.user, { password: hashedPassword });
        await dbToken.deleteOne();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export all controllers
module.exports = {
    signup,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword
};
