'use server'

import { cookies } from 'next/headers'
import { AiConversation, User } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'

export async function getConversations() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return []

    const list = await AiConversation.find({ userId: sessionCookie.value }).sort({ updatedAt: -1 })
    return JSON.parse(JSON.stringify(list))
  } catch (e) {
    console.error('Error fetching conversations:', e)
    return []
  }
}

export async function createConversation(title: string = 'New Conversation') {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }

    const conversation = new AiConversation({
      userId: sessionCookie.value,
      title,
      messages: []
    })
    await conversation.save()

    return { success: true, conversation: JSON.parse(JSON.stringify(conversation)) }
  } catch (error: any) {
    console.error('Error creating conversation:', error)
    return { success: false, error: error.message }
  }
}

export async function getConversationMessages(id: string) {
  try {
    await connectDB()
    const conversation = await AiConversation.findById(id)
    if (!conversation) return []
    return JSON.parse(JSON.stringify(conversation.messages))
  } catch (e) {
    console.error('Error fetching messages:', e)
    return []
  }
}
