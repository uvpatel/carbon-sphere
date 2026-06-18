import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const SimulationRunSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  baselineCo2e: { type: Number, required: true },
  projectedCo2e: { type: Number, required: true },
  scenariosToggled: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})
SimulationRunSchema.index({ userId: 1, createdAt: -1 })

const RawSimulationRun = models.SimulationRun || model('SimulationRun', SimulationRunSchema)
export const SimulationRun = createModelWrapper('SimulationRun', RawSimulationRun)
