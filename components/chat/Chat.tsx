'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ChatProps {
  isOpen: boolean
  onClose: () => void
  brandName?: string
  brandImage?: string
  mode?: 'list' | 'chat'
  onBackToList?: () => void
}

interface Message {
  id: number
  text: string
  isSent: boolean
  timestamp: string
}

export default function Chat({ isOpen, onClose, brandName, brandImage, mode = 'chat', onBackToList }: ChatProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! Welcome to ${brandName || 'our shop'}. How can I help you today?`,
      isSent: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        isSent: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed z-50 flex flex-col ${mode === 'chat' ? 'bottom-0 right-6' : 'top-16 right-4'}`}>
      <div className={`flex ${mode === 'chat' ? 'h-[500px] w-[380px] rounded-t-2xl' : 'h-[500px] w-[380px] rounded-lg'} flex-col bg-white shadow-2xl border border-gray-200`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-orange-500 px-4 py-3">
          <div className="flex items-center gap-3">
            {brandImage ? (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                <Image src={brandImage} alt={brandName || 'Brand'} fill className="object-contain p-1" unoptimized />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-orange-500">
                {brandName?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-white">{brandName || 'Shop'}</h3>
              <p className="text-xs text-orange-100">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-orange-600 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.isSent
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`mt-1 text-[10px] ${msg.isSent ? 'text-orange-100' : 'text-gray-500'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:bg-gray-100 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
