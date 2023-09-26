const mongoose = require('mongoose')
const EntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'speech progress',
        enum: ['speech progress', 'device maintainence', 'medication', 'reminder', 'milestones', 'research','other']
    },
    visibility: {
        type: String,
        default: 'private',
        enum: ['private', 'public', 'shared']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        // adding this fireld should be required because the app will break if the user is not present
    },
   
    createdAt: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Entry', EntrySchema)