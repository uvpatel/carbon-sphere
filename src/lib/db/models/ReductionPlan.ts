import { Schema, model, models } from 'mongoose'
import { PlanActionSchema, createModelWrapper } from './base'

const ReductionPlanSchema = new Schema({
  goalId: { type: Schema.Types.ObjectId, ref: 'CarbonGoal', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  status: { type: String, default: 'ACTIVE', index: true },
  actions: [PlanActionSchema]
}, { timestamps: true })

const RawReductionPlan = models.ReductionPlan || model('ReductionPlan', ReductionPlanSchema)
export const ReductionPlan = createModelWrapper('ReductionPlan', RawReductionPlan)
