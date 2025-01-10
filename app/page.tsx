'use client'

import Image from 'next/image'
import Chat from './components/Chat'
import { useState } from 'react'
import type { ThemeColor } from './types'

const getThemeClasses = (color: ThemeColor) => ({
  gradient: `from-${color}-50 to-${color}-100`,
  border: `border-${color}-300`,
  title: `from-${color}-600 to-${color}-500`,
  text: `text-${color}-700`
})

export default function Home() {
  const [themeColor, setThemeColor] = useState<ThemeColor>('yellow')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const classes = getThemeClasses(themeColor)

  return (
    <div className="relative">
      {/* 背景层 */}
      <div className={`fixed inset-0 bg-gradient-to-b ${classes.gradient} z-0`} />
      
      {/* 内容层 */}
      <div className="relative min-h-screen flex flex-col">
        {/* 导航栏 */}
        <nav className={`w-full bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 
                      flex items-center justify-between fixed top-0 z-10`}>
          <div className="flex items-center gap-2">
            <Image 
              src="/cat-logo.png" 
              alt="喵喵AI" 
              width={40} 
              height={40} 
              className={`rounded-full border-2 ${classes.border}`}
            />
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${classes.title} text-transparent bg-clip-text`}>
              喵喵AI
            </h1>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 min-h-[calc(100vh-120px)]">
            <Chat 
              onThemeChange={setThemeColor} 
              onModalStateChange={setIsModalOpen}
              showModal={isModalOpen}
            />
          </div>
        </main>

        <footer className={`w-full text-center py-4 text-sm ${classes.text}`}>
          © 2024 喵喵AI - 用AI让世界更有趣
        </footer>
      </div>
    </div>
  )
}