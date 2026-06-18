import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const AuditEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const RawAuditEvent = models.AuditEvent || model('AuditEvent', AuditEventSchema)
export const AuditEvent = createModelWrapper('AuditEvent', RawAuditEvent)
