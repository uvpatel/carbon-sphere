import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const AchievementDefinitionSchema = new Schema({
  badgeCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  criteria: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
})

const RawAchievementDefinition = models.AchievementDefinition || model('AchievementDefinition', AchievementDefinitionSchema)
export const AchievementDefinition = createModelWrapper('AchievementDefinition', RawAchievementDefinition)
