const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
    },
    email: {
        type: String,
        required: [true, "please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },

    password: {
        type: String,
        required: [true, "please add a password"],
        minlength: 4,
        select: false,
    },

    role: {
        type: String,
        enum: ['customer', 'seller'],
        default: 'customer',
    },

},

    {
        timestamps: true, // কখন অ্যাকাউন্ট খুললো সেটা (createdAt) অটোমেটিক সেভ হবে
    }
);


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        next();
    }
    const slat = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, slat);
    
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);