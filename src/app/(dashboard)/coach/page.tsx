'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Plus, 
  Brain, 
  User, 
  Loader
} from 'lucide-react'
import { getConversations, createConversation, getConversationMessages } from '@/server/actions/coach'

interface Message {
  role: 'user' | 'model' | 'system'
  content: string
  createdAt?: string
}

interface Conversation {
  _id: string
  title: string
  updatedAt: string
}

export default function CoachPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarLoading, setSidebarLoading] = useState(false)
  const [tokenUsage, setTokenUsage] = useState({ prompt: 140, completion: 480, limit: 10000 })
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const completeTextRef = useRef('')

  // 1. Load conversations list on mount
  const loadConversationsList = React.useCallback(async (selectFirst = true) => {
    setSidebarLoading(true)
    const list = await getConversations()
    setConversations(list)
    setSidebarLoading(false)
    if (selectFirst && list.length > 0) {
      setActiveId(prev => prev || list[0]._id)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversationsList()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadConversationsList])

  // 2. Load messages when activeId changes
  useEffect(() => {
    if (activeId) {
      getConversationMessages(activeId).then((history) => {
        setMessages(history)
      })
    }
  }, [activeId])

  // 3. Auto-scroll to bottom on messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 4. Create new conversation
  const handleNewConversation = async () => {
    const res = await createConversation(`Coach Session - ${new Date().toLocaleDateString()}`)
    if (res.success && res.conversation) {
      await loadConversationsList(false)
      setActiveId(res.conversation._id)
      setMessages([])
    }
  }

  // 5. Submit Message & Handle Streaming (Web Stream Compatible)
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !activeId) return
    
    const userMessage: Message = { role: 'user', content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: activeId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to stream response')
      }

      // Initialize AI response item
      const aiMessage: Message = { role: 'model', content: '' }
      setMessages(prev => [...prev, aiMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      completeTextRef.current = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          
          // Parse Vercel AI SDK data stream chunk
          // Each chunk is format `0:"word "\n`
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const textVal = JSON.parse(line.substring(2))
                completeTextRef.current += textVal
                setMessages(prev => {
                  const updated = [...prev]
                  if (updated.length > 0) {
                    updated[updated.length - 1] = {
                      role: 'model',
                      content: completeTextRef.current
                    }
                  }
                  return updated
                })
              } catch {
                // handle parsing edge-case fallback
              }
            }
          }
        }
      }

      // Increment token tracking metrics for UI Observability
      setTokenUsage(prev => ({
        ...prev,
        prompt: prev.prompt + Math.round(textToSend.length / 4),
        completion: prev.completion + Math.round(completeTextRef.current.length / 4)
      }))

    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error connecting to my core brain. Please check your credentials.' }
      ])
    } finally {
      setLoading(false)
      loadConversationsList(false) // refresh sidebar modified dates
    }
  }

  // Quick Chips
  const chips = [
    'How do I cut down my travel emissions?',
    'What is the best way to reduce heating bills?',
    'Tell me about plant-based diet offsets.'
  ]

  // Extremely robust, lightweight inline markdown helper
  const parseMarkdown = (text: string) => {
    // 1. Header 3
    let html = text.replace(/### (.*?)\n/g, '<h4 class="text-sm font-bold text-white mt-3 mb-1">$1</h4>')
    // 2. Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-semibold">$1</strong>')
    // 3. Bullets
    html = html.replace(/^- (.*?)\n/gm, '<li class="text-xs list-disc list-inside ml-2 my-0.5 text-zinc-300">$1</li>')
    // 4. Linebreaks
    html = html.split('\n').join('<br />')
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="space-y-6 pb-12 h-[calc(100vh-140px)] flex flex-col">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Sustainability Coach</h1>
          <p className="text-muted-foreground text-sm font-light">Powered by Google Gemini. Get tailored reduction advice.</p>
        </div>

        {/* AI Observability Metrics */}
        <div className="flex items-center gap-6 px-4 py-2 bg-card border border-border rounded-xl">
          <div className="text-left shrink-0">
            <span className="block text-[10px] font-semibold text-muted-foreground uppercase">Token Usage</span>
            <span className="block text-xs font-bold text-emerald-400">
              {(tokenUsage.prompt + tokenUsage.completion).toLocaleString()} / {tokenUsage.limit.toLocaleString()}
            </span>
          </div>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden shrink-0">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${Math.round(((tokenUsage.prompt + tokenUsage.completion) / tokenUsage.limit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Conversation Layout */}
      <div className="flex-1 flex gap-6 min-h-0 bg-background border border-border rounded-2xl overflow-hidden">
        {/* Left conversations list */}
        <div className="w-64 border-r border-border shrink-0 flex flex-col justify-between bg-card/50">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Chat Threads</span>
            <button
              onClick={handleNewConversation}
              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 cursor-pointer"
              title="New Chat"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sidebarLoading ? (
              <div className="flex justify-center py-8">
                <Loader size={18} className="animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map(conv => {
                const isActive = conv._id === activeId
                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveId(conv._id)}
                    className={`w-full p-3 text-left rounded-xl text-xs font-semibold cursor-pointer border border-transparent transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    <div className="truncate mb-0.5">{conv.title}</div>
                    <div className="text-[10px] font-light text-muted-foreground/85">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center text-xs text-muted-foreground py-8">No chats created yet.</div>
            )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col justify-between min-w-0 bg-card/20">
          {/* Active conversation message list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeId ? (
              messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isUser = msg.role === 'user'
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-4 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 border border-border ${
                        isUser ? 'bg-zinc-800 text-white' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                      }`}>
                        {isUser ? <User size={14} /> : <Brain size={14} />}
                      </div>

                      {/* Bubble */}
                      <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 border ${
                        isUser 
                          ? 'bg-zinc-900 border-border text-white rounded-tr-none' 
                          : 'bg-card/75 border-border/70 text-zinc-100 rounded-tl-none'
                      }`}>
                        {parseMarkdown(msg.content)}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400">
                    <Brain size={24} className="animate-pulse-slow" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">Ask your Sustainability Coach</h3>
                    <p className="text-xs text-muted-foreground font-light">
                      Ask questions about home energy conservation, eco-friendly transit shifts, waste reduction, or how to reduce emissions in your specific lifestyle.
                    </p>
                  </div>
                  {/* Suggestion Chips */}
                  <div className="flex flex-col gap-2 w-full">
                    {chips.map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleSendMessage(chip)}
                        className="p-3 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border text-left text-[11px] font-semibold text-muted-foreground hover:text-white cursor-pointer transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-light">
                Select a conversation thread or create a new one to begin.
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form input controls */}
          <div className="p-4 border-t border-border shrink-0 bg-card/40">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder={activeId ? "Type your query..." : "Create a new thread first"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!activeId || loading}
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || !activeId || loading}
                className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer disabled:opacity-30 disabled:scale-100 active:scale-95 transition-all"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
