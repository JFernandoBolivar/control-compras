'use client'

import { BarChart3, Clock, AlertCircle, FileText } from 'lucide-react'

interface SidebarProps {
  activeTab: 'dashboard' | 'timeline' | 'alerts' | 'expedientes'
  setActiveTab: (tab: 'dashboard' | 'timeline' | 'alerts' | 'expedientes') => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      icon: BarChart3,
      label: 'Dashboard',
      description: 'Panel de control'
    },
    {
      id: 'timeline',
      icon: Clock,
      label: 'Timeline',
      description: 'Trazabilidad'
    },
    {
      id: 'alerts',
      icon: AlertCircle,
      label: 'Alertas',
      description: 'Centro de alertas'
    },
    {
      id: 'expedientes',
      icon: FileText,
      label: 'Expedientes',
      description: 'Gestión'
    },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 min-h-screen fixed left-0 top-20 overflow-y-auto">
      <nav className="px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-start gap-4 px-4 py-4 rounded-lg transition-all duration-300 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className={`p-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/30'
                  : 'bg-slate-700 group-hover:bg-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className={`text-xs transition-colors ${
                  isActive
                    ? 'text-blue-100'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}>
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-100 mb-1">Estado del Sistema</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-slate-300">Operativo</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
