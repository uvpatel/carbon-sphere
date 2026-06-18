import mongoose, { Schema } from 'mongoose'
import { jsonDb, generateId } from '../jsonDb'

export const UserSettingsSchema = new Schema({
  theme: { type: String, default: 'system' },
  unitSystem: { type: String, default: 'metric' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false })

export const NotificationPreferenceSchema = new Schema({
  emailMarketing: { type: Boolean, default: false },
  emailMilestones: { type: Boolean, default: true },
  emailWeeklyDigest: { type: Boolean, default: true },
  pushEnabled: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false })

export const PlanActionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  estimatedSavings: { type: Number, required: true }, // in kg CO2e
  weekToStart: { type: Number, required: true },
  status: { type: String, default: 'PENDING' }, // PENDING, COMPLETED, SKIPPED
  completedAt: { type: Date }
})

export const AiMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'model', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export function createModelWrapper<T>(modelName: string, mongooseModel: T) {
  const isMongoConnected = () => mongoose.connection.readyState === 1

  class MockQuery {
    private results: Record<string, unknown>[]
    constructor(results: Record<string, unknown>[]) {
      this.results = results
    }
    sort(sortObj: Record<string, number>) {
      const key = Object.keys(sortObj)[0]
      const dir = sortObj[key]
      this.results.sort((a, b) => {
        const valA = a[key]
        const valB = b[key]
        if (valA instanceof Date && valB instanceof Date) {
          const timeA = valA.getTime()
          const timeB = valB.getTime()
          return dir === -1 ? timeB - timeA : timeA - timeB
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          const parsedA = Date.parse(valA)
          const parsedB = Date.parse(valB)
          if (!isNaN(parsedA) && !isNaN(parsedB)) {
            return dir === -1 ? parsedB - parsedA : parsedA - parsedB
          }
          return dir === -1 ? valB.localeCompare(valA) : valA.localeCompare(valB)
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return dir === -1 ? valB - valA : valA - valB
        }
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
          const foreignVal = item[foreignKey]
          if (foreignVal) {
            const refDoc = jsonDb.findById(refModelName, String(foreignVal))
            return { ...item, [foreignKey]: refDoc }
          }
          return item
        })
      }
      return this
    }
    then<TResult1 = Record<string, unknown>[]>(
      onfulfilled?: ((value: Record<string, unknown>[]) => TResult1 | PromiseLike<TResult1>) | null | undefined
    ) {
      return Promise.resolve(this.results).then(onfulfilled)
    }
  }

  class MockInstance {
    constructor(data: Record<string, unknown>) {
      Object.assign(this, data)
    }
    async save() {
      const self = this as unknown as Record<string, unknown>
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

  return new Proxy(mongooseModel as Record<string, unknown>, {
    construct(target, args) {
      if (isMongoConnected()) {
        const TargetClass = target as unknown as new (...args: unknown[]) => object
        return new TargetClass(...args)
      }
      return new MockInstance(args[0] as Record<string, unknown>)
    },
    get(target, prop) {
      if (isMongoConnected()) {
        return target[prop as string]
      }

      if (prop === 'find') {
        return (query: Record<string, unknown>) => {
          const res = jsonDb.find(modelName, query)
          return new MockQuery(res as Record<string, unknown>[])
        }
      }
      if (prop === 'findOne') {
        return (query: Record<string, unknown>) => {
          const res = jsonDb.findOne(modelName, query)
          if (!res) return Promise.resolve(null)
          return Promise.resolve(new MockInstance(res as Record<string, unknown>))
        }
      }
      if (prop === 'findById') {
        return (id: string) => {
          const res = jsonDb.findById(modelName, id)
          if (!res) return Promise.resolve(null)
          return Promise.resolve(new MockInstance(res as Record<string, unknown>))
        }
      }
      if (prop === 'create') {
        return async (doc: Record<string, unknown>) => {
          const res = jsonDb.create(modelName, doc)
          return new MockInstance(res as Record<string, unknown>)
        }
      }
      if (prop === 'insertMany') {
        return async (docs: Record<string, unknown>[]) => {
          const res = jsonDb.insertMany(modelName, docs)
          return res.map(doc => new MockInstance(doc as Record<string, unknown>))
        }
      }
      if (prop === 'deleteMany') {
        return (query: Record<string, unknown>) => {
          const res = jsonDb.deleteMany(modelName, query)
          return Promise.resolve(res)
        }
      }
      if (prop === 'updateOne') {
        return (query: Record<string, unknown>, update: Record<string, unknown>) => {
          const res = jsonDb.updateOne(modelName, query, update)
          return Promise.resolve(res)
        }
      }
      if (prop === 'countDocuments') {
        return (query: Record<string, unknown>) => {
          const res = jsonDb.find(modelName, query)
          return Promise.resolve(res.length)
        }
      }

      return target[prop as string]
    }
  }) as unknown as T
}
