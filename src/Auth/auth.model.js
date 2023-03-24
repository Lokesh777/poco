const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    username: {
        type: 'string',
        unique: true,
        min: 4,
        max: 20
    },
    email: {
        type: 'string',
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: 'string',
        required: true,
        min: 6,
        max: 1024
    },
    role: {
        type: 'string',
        enum: ['admin', 'user', 'manager'],
        required: true,
        default: 'admin'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    mobileNo: {
        type: String,
        minlength: 10,
        maxlength: 15,
        required: true,
        unique: true
    },
    otp: {
        type: String
    }
});

const Auth = mongoose.model("authentication",AuthSchema)

module.exports = Auth;