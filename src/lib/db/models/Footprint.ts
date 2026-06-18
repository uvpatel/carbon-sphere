import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const FootprintSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  totalCo2e: { type: Number, required: true },
  transportation: { type: Schema.Types.Mixed, required: true },
  energy: { type: Schema.Types.Mixed, required: true },
  diet: { type: Schema.Types.Mixed, required: true },
  shopping: { type: Schema.Types.Mixed, required: true },
  waste: { type: Schema.Types.Mixed, required: true },
  source: { type: String, default: 'MANUAL' },
  createdAt: { type: Date, default: Date.now }
})
FootprintSchema.index({ userId: 1, createdAt: -1 })

const RawFootprint = models.Footprint || model('Footprint', FootprintSchema)
export const Footprint = createModelWrapper('Footprint', RawFootprint)
