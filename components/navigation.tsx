'use client'

import { LayoutDashboard, Clock, Bell, FileText } from 'lucide-react'

interface NavigationProps {
  activeTab: 'dashboard' | 'timeline' | 'alerts' | 'expedientes'
  setActiveTab: (tab: 'dashboard' | 'timeline' | 'alerts' | 'expedientes') => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard Gerencial', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline de Trazabilidad', icon: Clock },
    { id: 'alerts', label: 'Centro de Alertas', icon: Bell },
    { id: 'expedientes', label: 'Gestión de Expedientes', icon: FileText },
  ]

  return (
    <nav className="bg-white border-b border-border shadow-xs sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === (tab.id as typeof activeTab)
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
