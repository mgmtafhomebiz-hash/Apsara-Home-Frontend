'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Message {
  id: string
  type: 'user' | 'agent'
  text: string
  timestamp: Date
  agentName?: string
}

interface Conversation {
  id: number
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
  messages?: Message[]
}

const CSR_NAMES = ['Sarah', 'Maria', 'John', 'Juan', 'Sofia']

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'list' | 'form' | 'chat'>('list')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [chatContext, setChatContext] = useState({ subject: '', description: '' })
  const [formData, setFormData] = useState({ subject: '', description: '' })
  const [formErrors, setFormErrors] = useState<{ subject?: string; description?: string }>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch existing conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true)

        // Get the session to get the access token
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!sessionResponse.ok) {
          setConversations([])
          setIsLoadingConversations(false)
          return
        }

        const session = await sessionResponse.json()
        const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken

        if (!accessToken) {
          setConversations([])
          setIsLoadingConversations(false)
          return
        }

        // Now fetch conversations with the token
        const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/conversations`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setConversations(data.data || [])
        } else if (response.status === 401) {
          setConversations([])
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
        setConversations([])
      } finally {
        setIsLoadingConversations(false)
      }
    }

    fetchConversations()
  }, [])

  const handleSelectConversation = async (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation)
    setSelectedConversation(conversation)
    setCurrentConversationId(conversation.id)
    setChatContext({
      subject: conversation.subject,
      description: conversation.description,
    })
    setIsLoadingMessages(true)

    // First, try to use existing messages from the conversation object
    console.log('Conversation has messages?', conversation.messages, conversation.messages?.length)
    if (conversation.messages && conversation.messages.length > 0) {
      console.log('Using existing messages from conversation object')
      setMessages(conversation.messages)
      setIsLoadingMessages(false)
      setStep('chat')
      return
    }

    // Fetch messages for this conversation from API
    console.log('Fetching messages from API for conversation ID:', conversation.id)
    try {
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      })

      console.log('Session response status:', sessionResponse.status)
      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        console.log('Session data:', session)
        const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken
        const currentUserId = (session?.user as { id?: number } | undefined)?.id

        if (accessToken) {
          console.log('Access token found, fetching messages...')
          console.log('Current user ID:', currentUserId)
          const messagesUrl = `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/conversations/${conversation.id}/messages`
          console.log('Messages API URL:', messagesUrl)
          
          const messagesResponse = await fetch(messagesUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })

          console.log('Messages API response status:', messagesResponse.status)
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            console.log('Fetched messages data:', messagesData)
            
            const messagesArray = messagesData.data || messagesData || []
            console.log('Messages array:', messagesArray)
            console.log('Messages array length:', messagesArray.length)
            
            const fetchedMessages: Message[] = messagesArray.map((msg: any) => {
              console.log('Processing message:', msg)
              const isUserMessage = msg.sender_id === currentUserId
              console.log('Is user message?', isUserMessage, 'sender_id:', msg.sender_id, 'currentUserId:', currentUserId)
              return {
                id: msg.id?.toString() || Date.now().toString(),
                type: isUserMessage ? 'user' : 'agent',
                text: msg.message || msg.text || '',
                timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
                agentName: !isUserMessage ? 'Support Team' : undefined,
              }
            })
            
            console.log('Mapped messages:', fetchedMessages)
            console.log('Setting messages state with', fetchedMessages.length, 'messages')
            setMessages(fetchedMessages)
            setIsLoadingMessages(false)
            setStep('chat')
            return
          } else {
            console.error('Messages API response not ok:', messagesResponse.status, messagesResponse.statusText)
            const errorText = await messagesResponse.text()
            console.error('Error response body:', errorText)
          }
        } else {
          console.error('No access token in session')
        }
      } else {
        console.error('Session response not ok:', sessionResponse.status)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }

    console.log('Falling back to initial message')
    setIsLoadingMessages(false)

    // Fallback to initial message if fetch fails
    const initialMessage: Message = {
      id: '0',
      type: 'agent',
      text: `Welcome back! 👋 You're viewing your conversation about "${conversation.subject}". Feel free to continue your discussion.`,
      timestamp: new Date(),
      agentName: 'Support Team',
    }
    setMessages([initialMessage])
    setStep('chat')
  }

  const handleStartNewChat = () => {
    setSelectedConversation(null)
    setFormData({ subject: '', description: '' })
    setFormErrors({})
    setStep('form')
  }

  const handleGoBack = () => {
    setStep('list')
    setSelectedConversation(null)
    setMessages([])
    setInputValue('')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { subject?: string; description?: string } = {}

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required'
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setChatContext({
      subject: formData.subject,
      description: formData.description,
    })
    setFormErrors({})

    // Create a new conversation
    try {
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      })

      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken

        if (accessToken) {
          const createResponse = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/conversations`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              subject: formData.subject,
              description: formData.description,
            }),
          })

          if (createResponse.ok) {
            const createdConversation = await createResponse.json()
            setCurrentConversationId(createdConversation.id)
            
            // Refresh conversations list
            const listResponse = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/conversations`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })

            if (listResponse.ok) {
              const data = await listResponse.json()
              setConversations(data.data || [])
            }

            // Move to chat with initial message
            const initialMessage: Message = {
              id: '1',
              type: 'agent',
              text: `Thank you for contacting us! 👋 We've received your issue regarding "${formData.subject}". A customer service representative will review your message and get back to you shortly. We appreciate your patience!`,
              timestamp: new Date(),
              agentName: 'Support Team',
            }

            setMessages([initialMessage])
            setStep('chat')
            return
          }
        }
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }

    // Fallback: move to chat without creating conversation
    const initialMessage: Message = {
      id: '1',
      type: 'agent',
      text: `Thank you for contacting us! 👋 We've received your issue regarding "${formData.subject}". A customer service representative will review your message and get back to you shortly. We appreciate your patience!`,
      timestamp: new Date(),
      agentName: 'Support Team',
    }

    setMessages([initialMessage])
    setStep('chat')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const messageText = inputValue.trim()

    // Add user message to local state immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSendingMessage(true)

    // Send message to API if we have a conversation ID
    if (currentConversationId) {
      try {
        const sessionResponse = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        })

        if (sessionResponse.ok) {
          const session = await sessionResponse.json()
          const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken

          if (accessToken) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/conversations/${currentConversationId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                message: messageText,
                attachment_url: null,
                attachment_filename: null,
              }),
            })

            if (response.ok) {
              setIsSendingMessage(false)
              return
            }
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }

    setIsSendingMessage(false)

    // Fallback: simulate agent response if API call fails or no conversation ID
    setIsTyping(true)
    setTimeout(() => {
      const randomCSR = CSR_NAMES[Math.floor(Math.random() * CSR_NAMES.length)]
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        text: 'Thank you for your message! I will look into this for you right away.',
        timestamp: new Date(),
        agentName: randomCSR,
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-6 z-[99] w-96 max-h-[600px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl dark:shadow-black/50 overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 px-5 py-4 flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3 flex-1">
          {(step === 'chat' || step === 'form') && (
            <button
              onClick={handleGoBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title="Back"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Customer Support</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {step === 'list' ? 'Your conversations' : step === 'form' ? 'Tell us about your issue' : 'We typically reply in minutes'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Conversations List Step */}
      {step === 'list' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoadingConversations ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin mb-3">
                  <svg className="h-8 w-8 text-orange-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversations...</p>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <svg className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">No conversations yet</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">Start a new chat to get help</p>
              <button
                onClick={handleStartNewChat}
                className="rounded-lg bg-orange-500 text-white font-semibold py-2 px-4 hover:bg-orange-600 transition-colors text-sm"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                {conversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className="w-full px-4 py-3 flex flex-col gap-2 transition-colors text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{conversation.subject}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{conversation.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(conversation.created_at).toLocaleDateString('en-PH')}
                    </p>
                  </motion.button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shrink-0">
                <button
                  onClick={handleStartNewChat}
                  className="w-full rounded-lg bg-orange-500 text-white font-semibold py-2.5 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start New Chat
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Form Step */}
      {step === 'form' && (
        <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Ticket Information */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Subject Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  if (formErrors.subject) setFormErrors((prev) => ({ ...prev, subject: undefined }))
                }}
                placeholder="Brief description of your issue"
                className={`w-full rounded-lg border ${
                  formErrors.subject ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all`}
              />
              {formErrors.subject && (
                <p className="mt-1 text-xs text-red-500">{formErrors.subject}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                  if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: undefined }))
                }}
                placeholder="Please provide more details about your issue..."
                rows={4}
                className={`w-full rounded-lg border ${
                  formErrors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all resize-none`}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
              )}
            </div>

            <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <span className="font-semibold">💡 Tip:</span> Providing detailed information helps us resolve your issue faster.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shrink-0">
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 text-white font-semibold py-2.5 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Start Chat
            </button>
          </div>
        </form>
      )}


      {step === 'chat' && (
        <>
          {/* Conversation Info */}
          {chatContext.subject && (
            <div className="px-5 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{chatContext.subject}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{chatContext.description}</p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/30">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin mb-3">
                    <svg className="h-8 w-8 text-orange-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${message.type === 'user' ? '' : 'flex flex-col gap-1'}`}>
                  {message.type === 'agent' && message.agentName && (
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2">
                      {message.agentName}
                    </p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
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

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isSendingMessage}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  )
}
