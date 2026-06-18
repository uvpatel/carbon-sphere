import { Schema, model, models } from 'mongoose'
import { AiMessageSchema, createModelWrapper } from './base'

const AiConversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  messages: [AiMessageSchema]
}, { timestamps: true })
AiConversationSchema.index({ userId: 1, updatedAt: -1 })

const RawAiConversation = models.AiConversation || model('AiConversation', AiConversationSchema)
export const AiConversation = createModelWrapper('AiConversation', RawAiConversation)
