import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const AiUsageTrackingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'AiConversation', index: true },
  model: { type: String, required: true },
  operationType: { type: String, required: true },
  promptTokens: { type: Number, required: true },
  completionTokens: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
})
AiUsageTrackingSchema.index({ userId: 1, createdAt: -1 })

const RawAiUsageTracking = models.AiUsageTracking || model('AiUsageTracking', AiUsageTrackingSchema)
export const AiUsageTracking = createModelWrapper('AiUsageTracking', RawAiUsageTracking)
