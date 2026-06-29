const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'user is already exists' });

        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        }

        else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }

};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        // ইমেইল দিয়ে ইউজার খোঁজা
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // পাসওয়ার্ড ম্যাচ করে কিনা দেখা (user অবজেক্ট নিশ্চিত থাকার পর)
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};





module.exports = { registerUser, loginUser };