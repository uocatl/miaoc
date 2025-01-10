'use client'

import type { ThemeColor, ChatSession } from '../types'

interface ChatHistoryProps {
  history: ChatSession[]
  onSelect: (sessionId: string) => void
  onClose: () => void
  themeColor: ThemeColor
}

export default function ChatHistory({ history, onSelect, onClose, themeColor }: ChatHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold text-${themeColor}-700`}>历史对话</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            暂无历史对话
          </div>
        ) : (
          <div className="space-y-2">
            {[...history]
              .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
              .map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelect(session.id)}
                  className={`
                    w-full text-left p-3 rounded-lg
                    hover:bg-${themeColor}-50
                    border border-${themeColor}-200
                    transition-colors duration-200
                  `}
                >
                  <div className="font-medium text-gray-700">
                    {formatDate(session.lastMessageTime)}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {session.messages[session.messages.length - 1]?.content || '空对话'}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
} 