'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { ThemeColor, Message as MessageType } from '../types'

// 直接定义 CodeProps 接口
interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface MessageProps {
  message: MessageType
  themeColor: ThemeColor
}

export default function Message({ message, themeColor }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI头像 */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2 border-2 border-amber-300">
          <Image
            src="/ai.png"
            alt="AI"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      )}
      
      {/* 消息气泡 */}
      <div className={`
        max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-sm
        ${isUser ? 
          `bg-gradient-to-r from-${themeColor}-500/90 to-${themeColor}-400/90 text-white rounded-tr-none` : 
          `bg-white/70 shadow-md rounded-tl-none border border-${themeColor}-100`
        }
      `}>
        {/* API Key 标识 */}
        {!isUser && message.apiKeyIndex && (
          <div className="text-xs text-amber-400 mb-1">模型 {message.apiKeyIndex}</div>
        )}
        
        {/* 消息内容 */}
        <div className={`
          markdown-body
          ${isUser ? 'text-white' : 'text-gray-700'}
        `}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="relative">
                      <div className="absolute top-2 right-2 text-xs text-amber-400">
                        {match[1]}
                      </div>
                      <pre className={`${className} rounded-lg p-4 bg-amber-900 text-amber-100 overflow-x-auto`}>
                        <code {...props} className={className}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-amber-100 text-amber-900 rounded px-1 py-0.5" {...props}>
                      {children}
                    </code>
                  )
                },
                pre({ children }) {
                  return <div className="my-2">{children}</div>
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>
                },
                ul({ children }) {
                  return <ul className="list-disc ml-4 mb-2">{children}</ul>
                },
                ol({ children }) {
                  return <ol className="list-decimal ml-4 mb-2">{children}</ol>
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  )
                },
                th({ children }) {
                  return <th className="border border-gray-300 px-4 py-2 bg-gray-100">{children}</th>
                },
                td({ children }) {
                  return <td className="border border-gray-300 px-4 py-2">{children}</td>
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {/* 用户头像 */}
      {isUser && (
        <div className="w-10 h-10 rounded-full overflow-hidden ml-2 border-2 border-amber-300">
          <Image
            src="/admin.png"
            alt="User"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
} 