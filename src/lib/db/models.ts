import mongoose, { Schema, model, models } from 'mongoose'
import { jsonDb, generateId } from './jsonDb'

// ---------------------------------------------------------
// EMBEDDED SUB-SCHEMAS
// ---------------------------------------------------------

const UserSettingsSchema = new Schema({
  theme: { type: String, default: 'system' },
  unitSystem: { type: String, default: 'metric' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false })

const NotificationPreferenceSchema = new Schema({
  emailMarketing: { type: Boolean, default: false },
  emailMilestones: { type: Boolean, default: true },
  emailWeeklyDigest: { type: Boolean, default: true },
  pushEnabled: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false })

const PlanActionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  estimatedSavings: { type: Number, required: true }, // in kg CO2e
  weekToStart: { type: Number, required: true },
  status: { type: String, default: 'PENDING' }, // PENDING, COMPLETED, SKIPPED
  completedAt: { type: Date }
})

const AiMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'model', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// ---------------------------------------------------------
// MONGOOSE SCHEMAS
// ---------------------------------------------------------

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  status: { type: String, default: 'ACTIVE' },
  settings: { type: UserSettingsSchema, default: () => ({}) },
  notificationPreference: { type: NotificationPreferenceSchema, default: () => ({}) },
  deletedAt: { type: Date }
}, { timestamps: true })

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

const SimulationRunSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  baselineCo2e: { type: Number, required: true },
  projectedCo2e: { type: Number, required: true },
  scenariosToggled: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})
SimulationRunSchema.index({ userId: 1, createdAt: -1 })

const CarbonGoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetCo2e: { type: Number, required: true },
  baselineCo2e: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'ACTIVE', index: true }
}, { timestamps: true })

const ReductionPlanSchema = new Schema({
  goalId: { type: Schema.Types.ObjectId, ref: 'CarbonGoal', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  status: { type: String, default: 'ACTIVE', index: true },
  actions: [PlanActionSchema]
}, { timestamps: true })

const AchievementDefinitionSchema = new Schema({
  badgeCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  criteria: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
})

const UserAchievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: Schema.Types.ObjectId, ref: 'AchievementDefinition', required: true },
  unlockedAt: { type: Date, default: Date.now }
})
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

const ActivityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
})
ActivityLogSchema.index({ userId: 1, eventType: 1, createdAt: -1 })

const AiConversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  messages: [AiMessageSchema]
}, { timestamps: true })
AiConversationSchema.index({ userId: 1, updatedAt: -1 })

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

const AuditEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
})

// ---------------------------------------------------------
// TRANSPARENT FALLBACK PROXY WRAPPER
// ---------------------------------------------------------

function createModelWrapper(modelName: string, mongooseModel: any) {
  const isMongoConnected = () => mongoose.connection.readyState === 1

  class MockQuery {
    private results: any[]
    constructor(results: any[]) {
      this.results = results
    }
    sort(sortObj: any) {
      const key = Object.keys(sortObj)[0]
      const dir = sortObj[key]
      this.results.sort((a, b) => {
        let valA = a[key]
        let valB = b[key]
        if (valA instanceof Date) valA = valA.getTime()
        if (valB instanceof Date) valB = valB.getTime()
        if (typeof valA === 'string' && !isNaN(Date.parse(valA))) valA = Date.parse(valA)
        if (typeof valB === 'string' && !isNaN(Date.parse(valB))) valB = Date.parse(valB)
        if (valA < valB) return dir === -1 ? 1 : -1
        if (valA > valB) return dir === -1 ? -1 : 1
        return 0
      })
      return this
    }
    limit(n: number) {
      this.results = this.results.slice(0, n)
      return this
    }
    populate(pathStr: string) {
      if (pathStr === 'goalId' || pathStr === 'achievementId') {
        const refModelName = pathStr === 'goalId' ? 'CarbonGoal' : 'AchievementDefinition'
        this.results = this.results.map(item => {
          const foreignKey = pathStr === 'goalId' ? 'goalId' : 'achievementId'
          if (item[foreignKey]) {
            const refDoc = jsonDb.findById(refModelName, item[foreignKey].toString())
            return { ...item, [foreignKey]: refDoc }
          }
          return item
        })
      }
      return this
    }
    then(onfulfilled?: (value: any) => any) {
      return Promise.resolve(this.results).then(onfulfilled)
    }
  }

  class MockInstance {
    constructor(data: any) {
      Object.assign(this, data)
    }
    async save() {
      const self = this as any
      if (self._id) {
        jsonDb.updateOne(modelName, { _id: self._id }, self)
        return self
      } else {
        self._id = generateId()
        const saved = jsonDb.create(modelName, self)
        Object.assign(self, saved)
        return self
      }
    }
  }

  return new Proxy(mongooseModel, {
    construct(target, args) {
      if (isMongoConnected()) {
        return new target(...args)
      }
      return new MockInstance(args[0])
    },
    get(target, prop) {
      if (isMongoConnected()) {
        return target[prop]
      }

      if (prop === 'find') {
        return (query: any) => {
          const res = jsonDb.find(modelName, query)
          return new MockQuery(res)
        }
      }
      if (prop === 'findOne') {
        return (query: any) => {
          const res = jsonDb.findOne(modelName, query)
          if (!res) return Promise.resolve(null)
          return Promise.resolve(new MockInstance(res))
        }
      }
      if (prop === 'findById') {
        return (id: string) => {
          const res = jsonDb.findById(modelName, id)
          if (!res) return Promise.resolve(null)
          return Promise.resolve(new MockInstance(res))
        }
      }
      if (prop === 'create') {
        return async (doc: any) => {
          const res = jsonDb.create(modelName, doc)
          return new MockInstance(res)
        }
      }
      if (prop === 'insertMany') {
        return async (docs: any[]) => {
          const res = jsonDb.insertMany(modelName, docs)
          return res.map(doc => new MockInstance(doc))
        }
      }
      if (prop === 'deleteMany') {
        return (query: any) => {
          const res = jsonDb.deleteMany(modelName, query)
          return Promise.resolve(res)
        }
      }
      if (prop === 'updateOne') {
        return (query: any, update: any) => {
          const res = jsonDb.updateOne(modelName, query, update)
          return Promise.resolve(res)
        }
      }
      if (prop === 'countDocuments') {
        return (query: any) => {
          const res = jsonDb.find(modelName, query)
          return Promise.resolve(res.length)
        }
      }

      return target[prop]
    }
  })
}

// ---------------------------------------------------------
// EXPORT MODELS WITH FALLBACKS
// ---------------------------------------------------------

const RawUser = models.User || model('User', UserSchema)
const RawFootprint = models.Footprint || model('Footprint', FootprintSchema)
const RawSimulationRun = models.SimulationRun || model('SimulationRun', SimulationRunSchema)
const RawCarbonGoal = models.CarbonGoal || model('CarbonGoal', CarbonGoalSchema)
const RawReductionPlan = models.ReductionPlan || model('ReductionPlan', ReductionPlanSchema)
const RawAchievementDefinition = models.AchievementDefinition || model('AchievementDefinition', AchievementDefinitionSchema)
const RawUserAchievement = models.UserAchievement || model('UserAchievement', UserAchievementSchema)
const RawActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema)
const RawAiConversation = models.AiConversation || model('AiConversation', AiConversationSchema)
const RawAiUsageTracking = models.AiUsageTracking || model('AiUsageTracking', AiUsageTrackingSchema)
const RawAuditEvent = models.AuditEvent || model('AuditEvent', AuditEventSchema)

export const User = createModelWrapper('User', RawUser)
export const Footprint = createModelWrapper('Footprint', RawFootprint)
export const SimulationRun = createModelWrapper('SimulationRun', RawSimulationRun)
export const CarbonGoal = createModelWrapper('CarbonGoal', RawCarbonGoal)
export const ReductionPlan = createModelWrapper('ReductionPlan', RawReductionPlan)
export const AchievementDefinition = createModelWrapper('AchievementDefinition', RawAchievementDefinition)
export const UserAchievement = createModelWrapper('UserAchievement', RawUserAchievement)
export const ActivityLog = createModelWrapper('ActivityLog', RawActivityLog)
export const AiConversation = createModelWrapper('AiConversation', RawAiConversation)
export const AiUsageTracking = createModelWrapper('AiUsageTracking', RawAiUsageTracking)
export const AuditEvent = createModelWrapper('AuditEvent', RawAuditEvent)
