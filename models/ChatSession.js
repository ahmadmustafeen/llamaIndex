const { Schema, model } = require("mongoose")


const chatSessionSchema = new Schema({
    userId: { type: String, ref: 'User', required: true },
    lastAccessed: { type: Date, default: Date.now, required: true },
    status: { type: String, default: 'ACTIVE' }
}, {
    timestamps: true
})

chatSessionSchema.index({ userId: 1 })

const ChatSession = model('ChatSession', chatSessionSchema, 'chatSession')

module.exports = ChatSession