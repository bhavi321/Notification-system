const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: 'UserCollection',
        required: true
    },
    message:{
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = new mongoose.model('NotificationCollection', notificationSchema);