'use client'

import { ThemeColor } from '../types'

interface SettingsProps {
  settings: {
    temperature: number
    apiKeys: string[]
    activeKeyIndex: number
    themeColor: ThemeColor
    nextModelIndex: number
  }
  onSettingsChange: (settings: any) => void
  onClose: () => void
}

export default function Settings({ settings, onSettingsChange, onClose }: SettingsProps) {
  const themeColorConfig = {
    yellow: { 
      name: '温暖黄', 
      from: 'from-amber-500', 
      to: 'to-yellow-400',
      color: 'rgb(245, 158, 11)'
    },
    purple: { 
      name: '优雅紫', 
      from: 'from-purple-500', 
      to: 'to-pink-500',
      color: 'rgb(168, 85, 247)'
    },
    red: { 
      name: '热情红', 
      from: 'from-red-500', 
      to: 'to-rose-400',
      color: 'rgb(239, 68, 68)'
    },
    orange: { 
      name: '活力橙', 
      from: 'from-orange-500', 
      to: 'to-amber-400',
      color: 'rgb(249, 115, 22)'
    },
    blue: { 
      name: '沉稳蓝', 
      from: 'from-blue-500', 
      to: 'to-cyan-400',
      color: 'rgb(59, 130, 246)'
    }
  }

  const handleThemeChange = (newTheme: ThemeColor) => {
    document.documentElement.style.setProperty('--theme-color', themeColorConfig[newTheme].color)
    onSettingsChange({
      ...settings,
      themeColor: newTheme
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 shadow-xl 
                    !blur-none transform scale-100 opacity-100 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold text-${settings.themeColor}-700`}>设置</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* 下一次使用的模型选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            下一次使用的模型
          </label>
          <select
            value={settings.nextModelIndex}
            onChange={(e) => {
              const selectedIndex = parseInt(e.target.value)
              if (selectedIndex === 0) {
                // 如果选择模型1，自动切换到模型4
                onSettingsChange({
                  ...settings,
                  nextModelIndex: 3
                })
                alert('模型1是应急模型，已自动为您切换到模型4')
              } else {
                onSettingsChange({
                  ...settings,
                  nextModelIndex: selectedIndex
                })
              }
            }}
            className={`w-full p-2 border border-${settings.themeColor}-200 rounded-md 
                      focus:ring-2 focus:ring-${settings.themeColor}-500 focus:ring-opacity-50`}
          >
            {settings.apiKeys.map((_, index) => (
              <option 
                key={index} 
                value={index}
                disabled={index === 0} // 禁用模型1
              >
                模型 {index + 1} {index === 0 ? '(应急模型)' : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            模型1为应急模型，仅在其他模型不可用时自动使用
          </p>
        </div>

        {/* 主题色选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            主题色
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(themeColorConfig).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key as ThemeColor)}
                className={`
                  p-2 rounded-lg text-xs text-center
                  ${settings.themeColor === key ? 'ring-2 ring-offset-2' : ''}
                  bg-gradient-to-r ${value.from} ${value.to} text-white
                `}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature 设置 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => onSettingsChange({
              ...settings,
              temperature: parseFloat(e.target.value)
            })}
            className="w-full accent-current"
          />
          <p className="text-xs text-gray-500 mt-1">
            较低的值使回答更加确定，较高的值使回答更有创造性
          </p>
        </div>

        <button
          onClick={onClose}
          className={`
            w-full text-white rounded-lg py-2 px-4 
            transition-all duration-200
            bg-gradient-to-r ${themeColorConfig[settings.themeColor].from} ${themeColorConfig[settings.themeColor].to}
          `}
        >
          保存
        </button>
      </div>
    </div>
  )
} 