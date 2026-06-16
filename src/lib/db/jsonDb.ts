import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'src/lib/db/db.json')

// Generate simple string IDs mimicking MongoDB's ObjectIds
export function generateId(): string {
  return Math.random().toString(16).substring(2, 10) + 
         Math.random().toString(16).substring(2, 10) + 
         Math.random().toString(16).substring(2, 10)
}

function readData(): Record<string, any[]> {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2))
      return {}
    }
    const data = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    console.error('Error reading JSON DB file:', e)
    return {}
  }
}

function writeData(data: Record<string, any[]>) {
  try {
    const dir = path.dirname(DB_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('Error writing to JSON DB file:', e)
  }
}

function matches(doc: any, query: any): boolean {
  if (!query || Object.keys(query).length === 0) return true
  
  for (const key in query) {
    const queryVal = query[key]
    
    // Support regex query objects (like { $regex: '...' })
    if (queryVal && typeof queryVal === 'object' && '$regex' in queryVal) {
      const regex = new RegExp(queryVal.$regex, queryVal.$options || '')
      if (!regex.test(doc[key] || '')) return false
      continue
    }

    // Support standard key matching
    let docVal = doc[key]
    if (docVal && docVal._id) docVal = docVal._id // handle populated objects

    const docStr = docVal ? docVal.toString() : ''
    const queryStr = queryVal ? queryVal.toString() : ''
    
    if (docStr !== queryStr) {
      return false
    }
  }
  return true
}

export const jsonDb = {
  find(collectionName: string, query: any = {}) {
    const data = readData()
    const list = data[collectionName] || []
    return list.filter(item => matches(item, query))
  },

  findOne(collectionName: string, query: any = {}) {
    const results = this.find(collectionName, query)
    return results[0] || null
  },

  findById(collectionName: string, id: string) {
    const data = readData()
    const list = data[collectionName] || []
    return list.find(item => item._id === id || item._id?.toString() === id.toString()) || null
  },

  create(collectionName: string, doc: any) {
    const data = readData()
    if (!data[collectionName]) {
      data[collectionName] = []
    }
    
    const newDoc = {
      _id: doc._id || generateId(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    }
    
    data[collectionName].push(newDoc)
    writeData(data)
    return newDoc
  },

  insertMany(collectionName: string, docs: any[]) {
    const data = readData()
    if (!data[collectionName]) {
      data[collectionName] = []
    }
    
    const newDocs = docs.map(doc => ({
      _id: doc._id || generateId(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    }))
    
    data[collectionName].push(...newDocs)
    writeData(data)
    return newDocs
  },

  deleteMany(collectionName: string, query: any = {}) {
    const data = readData()
    const list = data[collectionName] || []
    const remaining = list.filter(item => !matches(item, query))
    const deletedCount = list.length - remaining.length
    data[collectionName] = remaining
    writeData(data)
    return { deletedCount }
  },

  updateOne(collectionName: string, query: any, update: any) {
    const data = readData()
    const list = data[collectionName] || []
    let updatedCount = 0
    
    const updatedList = list.map(item => {
      if (matches(item, query)) {
        updatedCount++
        
        let updatedItem = { ...item }
        
        // Support $set operator or plain object update
        if (update.$set) {
          updatedItem = { ...updatedItem, ...update.$set }
        } else if (update.$push) {
          for (const key in update.$push) {
            if (!Array.isArray(updatedItem[key])) {
              updatedItem[key] = []
            }
            updatedItem[key].push(update.$push[key])
          }
        } else {
          updatedItem = { ...updatedItem, ...update }
        }
        
        updatedItem.updatedAt = new Date().toISOString()
        return updatedItem
      }
      return item
    })
    
    data[collectionName] = updatedList
    writeData(data)
    return { matchedCount: updatedCount, modifiedCount: updatedCount }
  }
}
