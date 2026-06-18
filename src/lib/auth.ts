import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { memoryAdapter, type MemoryDB } from "@better-auth/memory-adapter"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const authMemoryDb: MemoryDB = {}

const getAdapter = () => {
  const mongoUri = process.env.MONGODB_URI
  if (mongoUri) {
    try {
      const client = new MongoClient(mongoUri)
      const db = client.db()
      return mongodbAdapter(db, { client })
    } catch (e) {
      console.warn("Failed to initialize MongoDB client for auth, using memory fallback:", e)
    }
  }
  return memoryAdapter(authMemoryDb)
}

export const auth = betterAuth({
  database: getAdapter(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  plugins: [
    nextCookies(),
  ],
})
