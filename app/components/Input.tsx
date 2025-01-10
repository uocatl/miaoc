'use client'

import { useState } from 'react'
import type { ThemeColor } from '../types'

interface InputProps {
  onSend: (content: string) => void
  disabled?: boolean
  themeColor: ThemeColor
}

export default function Input({ onSend, disabled, themeColor }: InputProps) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !disabled) {
      onSend(content)
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="和喵喵聊天吧..."
          className={`flex-1 p-3 rounded-xl border border-${themeColor}-200 
                     focus:outline-none focus:ring-2 focus:ring-${themeColor}-500/50 
                     focus:border-${themeColor}-500 bg-white/50 backdrop-blur-sm
                     transition-all duration-200`}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!content.trim() || disabled}
          className={`px-4 py-2 rounded-xl bg-gradient-to-r from-${themeColor}-500 
                     to-${themeColor}-400 text-white font-medium 
                     hover:from-${themeColor}-600 hover:to-${themeColor}-500 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200`}
        >
          发送
        </button>
      </div>
    </form>
  )
} 