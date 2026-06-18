import { Schema, model, models } from 'mongoose'
import { UserSettingsSchema, NotificationPreferenceSchema, createModelWrapper } from './base'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  status: { type: String, default: 'ACTIVE' },
  settings: { type: UserSettingsSchema, default: () => ({}) },
  notificationPreference: { type: NotificationPreferenceSchema, default: () => ({}) },
  deletedAt: { type: Date }
}, { timestamps: true })

const RawUser = models.User || model('User', UserSchema)
export const User = createModelWrapper('User', RawUser)
