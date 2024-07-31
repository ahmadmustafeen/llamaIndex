const { Schema, model } = require("mongoose")

const messageSchema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    role: { type: String, required: true },
    text: { type: String },
    image: { type: String },
    voice: { type: String },
    starred: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    reaction: { type: String, default: 'NONE' }
}, {
    timestamps: true
})

messageSchema.index({ sessionId: 1, createdAt: 1 })

const ChatMessage = model('ChatMessage', messageSchema, 'chatMessage')

module.exports = ChatMessage