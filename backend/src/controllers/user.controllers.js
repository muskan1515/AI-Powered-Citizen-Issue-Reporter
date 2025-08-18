const User = require('../models/User');

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update current user profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Optional: filter allowed fields to prevent unwanted updates
        const allowedUpdates = ['name', 'gender', 'birthDate', 'address'];
        const filteredUpdates = {};
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) filteredUpdates[field] = updates[field];
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            filteredUpdates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
