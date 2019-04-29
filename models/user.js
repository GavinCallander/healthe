const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a valid username'],
        minlength: [1, 'Username must contain 1 or more characters'],
        maxlength: [99, 'Username cannot exceed 99 characters']
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [8, 'Password must contain at least 8 characters'],
        maxlength: [128, 'Password cannot exceed 128 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email'],
        minlength: [5, 'Please enter a valid email'],
        maxlength: [99, 'Please enter a valid email']
    }
});
// This returns an object without a password
userSchema.set('toObject', {
    transform: function(doc, ret, options) {
        let returnJson = {
            _id: ret._id,
            email: ret.email,
            username: ret.username
        }
        return returnJson;
    }
});

userSchema.methods.authenticated = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
    if (this.isNew) {
        let hash = bcrypt.hashSync(this.password, 12);
        this.password = hash;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);