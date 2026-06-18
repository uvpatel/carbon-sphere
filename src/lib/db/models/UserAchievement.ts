import { Schema, model, models } from 'mongoose'
import { createModelWrapper } from './base'

const UserAchievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: Schema.Types.ObjectId, ref: 'AchievementDefinition', required: true },
  unlockedAt: { type: Date, default: Date.now }
})
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

const RawUserAchievement = models.UserAchievement || model('UserAchievement', UserAchievementSchema)
export const UserAchievement = createModelWrapper('UserAchievement', RawUserAchievement)
