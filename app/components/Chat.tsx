'use client'

import { useState, useRef, useEffect } from 'react'
import Message from './Message'
import Input from './Input'
import Settings from './Settings'
import ChatHistory from './ChatHistory'
import type { Message as MessageType, Settings as SettingsType, ChatSession, ThemeColor } from '../types'
import Image from 'next/image'
import Markdown from './Markdown'

// 添加 UserIcon 组件
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
)

interface ChatProps {
  onThemeChange: (theme: ThemeColor) => void
  onModalStateChange: (isOpen: boolean) => void
  showModal: boolean
}

export default function Chat({ onThemeChange, onModalStateChange, showModal }: ChatProps) {
  const initialSettings: SettingsType = {
    temperature: 0.7,
    apiKeys: [
      'sk-9456b404b3e649f09438baacf7261d08',
      'sk-872485e2b3fb433c9b1c722abe62fcca',
      'sk-49c862e407514e2ab38d940d718fe7a0',
      'sk-25e338b7b6a54d0aa46f02ed7a288745',
      'sk-cc91cb8583204bdda72a8bbd374c101a',
      'sk-b3635a9e4c5d4c728870430f6303ec67'
    ],
    activeKeyIndex: 1,
    themeColor: 'yellow',
    nextModelIndex: 1
  }

  // 正确的 useState 声明方式
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)
  const [thinkingTime, setThinkingTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<SettingsType>(initialSettings)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState(`session-${Date.now()}`)
  const [showHistory, setShowHistory] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 加载历史聊天记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory')
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 保存当前会话到历史记录
  const saveCurrentSession = () => {
    if (messages.length > 0) {
      const newSession: ChatSession = {
        id: currentSessionId,
        messages: messages,
        lastMessageTime: Date.now()
      }

      setChatHistory(prev => {
        const updatedHistory = [...prev.filter(s => s.id !== currentSessionId), newSession]
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory))
        return updatedHistory
      })
    }
  }

  // 在消息更新时保存会话
  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentSession()
    }
  }, [messages])

  // 开始新会话
  const startNewChat = () => {
    saveCurrentSession()
    setCurrentSessionId(`session-${Date.now()}`)
    setMessages([])
  }

  // 加载历史会话
  const loadSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId)
    if (session) {
      setMessages(session.messages)
      setCurrentSessionId(sessionId)
      setShowHistory(false)
    }
  }

  const sendMessage = async (content: string) => {
    try {
      setLoading(true)
      setThinkingTime(0)
      
      timerRef.current = setInterval(() => {
        setThinkingTime(prev => prev + 1)
      }, 1000)

      const userMessage: MessageType = { role: 'user', content }
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }))

      // 使用用户选择的下一个模型
      const useModelIndex = settings.nextModelIndex
      let response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKeys[useModelIndex]}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: apiMessages,
          temperature: settings.temperature
        })
      })

      if (!response.ok) {
        // 如果当前 key 失败，尝试其他 key
        for (let i = 0; i < settings.apiKeys.length; i++) {
          if (i === settings.activeKeyIndex) continue
          
          try {
            response = await fetch('https://api.deepseek.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKeys[i]}`
              },
              body: JSON.stringify({
                model: 'deepseek-chat',
                messages: apiMessages,
                temperature: settings.temperature
              })
            })

            if (response.ok) {
              setSettings(prev => ({ ...prev, activeKeyIndex: i }))
              break
            }
          } catch (e) {
            continue
          }
        }
      }

      if (!response.ok) {
        throw new Error('所有 API Key 都失败了')
      }

      const data = await response.json()
      
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: data.choices[0].message.content,
        apiKeyIndex: useModelIndex + 1  // 显示用户选择的模型编号
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '喵呜...出错了，请稍后再试',
        apiKeyIndex: 0
      }])
    } finally {
      setLoading(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  // 在 settings 变化时更新主题
  useEffect(() => {
    onThemeChange(settings.themeColor)
  }, [settings.themeColor, onThemeChange])

  useEffect(() => {
    onModalStateChange(showSettings || showHistory)
  }, [showSettings, showHistory, onModalStateChange])

  const getThemeClasses = (color: ThemeColor) => ({
    border: `border-${color}-300`
  })

  const renderMessage = (message: MessageType) => {
    const classes = getThemeClasses(settings.themeColor)
    
    if (message.role === 'assistant') {
      return (
        <div className="flex gap-3 py-3">
          <div className={`w-7 h-7 rounded-full border-2 flex-shrink-0 
                       flex items-center justify-center bg-white/50
                       ${classes.border}`}>
            <Image src="/cat-logo.png" alt="AI" width={20} height={20} />
          </div>
          <div className="flex-1">
            <Markdown content={message.content} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex gap-3 py-3">
          <div className={`w-7 h-7 rounded-full bg-white/50 border-2 flex-shrink-0 
                       flex items-center justify-center
                       ${classes.border}`}>
            <UserIcon />
          </div>
          <div className="flex-1">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* 顶部按钮栏 */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`text-${settings.themeColor}-600 hover:text-${settings.themeColor}-700 transition-colors`}
          >
            📚 历史记录
          </button>
          <button
            onClick={startNewChat}
            className={`text-${settings.themeColor}-600 hover:text-${settings.themeColor}-700 transition-colors`}
          >
            ✨ 新对话
          </button>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`text-${settings.themeColor}-600 hover:text-${settings.themeColor}-700 transition-colors`}
        >
          ⚙️ 设置
        </button>
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 z-[200]">
          {/* 模糊背景 - 添加圆角和内边距 */}
          <div className="absolute inset-4 backdrop-blur-sm bg-black/10 
                         rounded-2xl transition-all duration-200" />
          
          {/* 设置面板 */}
          {showSettings && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings
                settings={settings}
                onSettingsChange={setSettings}
                onClose={() => setShowSettings(false)}
              />
            </div>
          )}

          {/* 历史记录面板 */}
          {showHistory && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ChatHistory
                history={chatHistory}
                onSelect={loadSession}
                onClose={() => setShowHistory(false)}
                themeColor={settings.themeColor}
              />
            </div>
          )}
        </div>
      )}

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            themeColor={settings.themeColor}
          />
        ))}
        {loading && (
          <div className={`text-center text-${settings.themeColor}-700 animate-pulse`}>
            喵喵思考中 (已思考 {thinkingTime} 秒)...
          </div>
        )}
      </div>
      <Input onSend={sendMessage} disabled={loading} themeColor={settings.themeColor} />
    </div>
  )
} 