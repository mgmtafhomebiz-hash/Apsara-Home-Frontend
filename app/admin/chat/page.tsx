'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ChatConversation {
  id: number
  customer: {
    id: number
    name: string
    username: string
    email: string
    mobile: string
    avatar_url: string
  }
  subject: string
  description: string
  status: string
  assigned_agent_id: number | null
  assigned_agent: any | null
  last_message: string | null
  message_count: number
  unread_count: number
  resolved_at: string | null
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  userId: number
  senderType: 'csr' | 'user'
  text: string
  timestamp: Date
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)

        // Get the session to get the access token
        const sessionResponse = await fetch('/api/admin/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!sessionResponse.ok) {
          setConversations([])
          setIsLoading(false)
          return
        }

        const session = await sessionResponse.json()
        const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken

        if (!accessToken) {
          setConversations([])
          setIsLoading(false)
          return
        }

        // Fetch conversations with the token
        const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/admin/conversations`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          const convoList = data.data || []
          setConversations(convoList)

          // Auto-select first conversation
          if (convoList.length > 0 && !selectedConversationId) {
            setSelectedConversationId(convoList[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
        setConversations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId)
    // Reset messages - in a real app, you'd fetch the conversation messages here
    setMessages([])
    setInputValue('')
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !selectedConversationId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: selectedConversationId,
      senderType: 'csr',
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate user response after delay
    setTimeout(() => {
      const userResponse: Message = {
        id: (Date.now() + 1).toString(),
        userId: selectedConversationId,
        senderType: 'user',
        text: 'Thank you for the response!',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userResponse])
      setIsTyping(false)
    }, 2000)
  }

  const filteredConversations = conversations.filter((convo) =>
    convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    convo.customer?.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-PH')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex gap-6 p-6">
      {/* Sidebar - Conversations List */}
      <div className="w-full sm:w-80 flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Conversations</h2>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {isLoading ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full px-5 py-4 flex items-start gap-4 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  selectedConversationId === conversation.id
                    ? 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(conversation.customer?.name || 'User')}
                  </div>
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                      {conversation.customer?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                      {formatTime(conversation.updated_at)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate mb-1">
                    {conversation.subject}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
                    {conversation.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      conversation.status === 'open'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : conversation.status === 'closed'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Unread Badge */}
                {conversation.unread_count > 0 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white shrink-0">
                    {conversation.unread_count}
                  </div>
                )}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden sm:flex flex-1 flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(selectedConversation.customer?.name || 'User')}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedConversation.customer?.name || 'Unknown User'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedConversation.customer?.email}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {selectedConversation.subject}
                </p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedConversation.status === 'open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : selectedConversation.status === 'closed'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {selectedConversation.status.charAt(0).toUpperCase() + selectedConversation.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Customer Info Bar */}
            <div className="px-6 py-4 bg-white dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Email</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{selectedConversation.customer?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedConversation.customer?.mobile}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Username</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedConversation.customer?.username}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/30">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      No messages yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedConversation.subject}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.senderType === 'csr' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderType === 'csr'
                          ? 'bg-orange-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderType === 'csr' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('en-PH', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
