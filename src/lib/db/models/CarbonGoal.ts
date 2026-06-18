import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const CarbonGoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetCo2e: { type: Number, required: true },
  baselineCo2e: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'ACTIVE', index: true }
}, { timestamps: true })

const RawCarbonGoal = models.CarbonGoal || model('CarbonGoal', CarbonGoalSchema)
export const CarbonGoal = createModelWrapper('CarbonGoal', RawCarbonGoal)
