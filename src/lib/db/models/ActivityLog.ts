import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const ActivityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})
ActivityLogSchema.index({ userId: 1, eventType: 1, createdAt: -1 })

const RawActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema)
export const ActivityLog = createModelWrapper('ActivityLog', RawActivityLog)
