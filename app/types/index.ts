export type ThemeColor = 'yellow' | 'purple' | 'red' | 'orange' | 'blue'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  apiKeyIndex?: number
  timestamp?: number
}

export interface Settings {
  temperature: number
  apiKeys: string[]
  activeKeyIndex: number
  themeColor: ThemeColor
  nextModelIndex: number
}

export interface ChatSession {
  id: string
  messages: any[]
  lastMessageTime: number
} 