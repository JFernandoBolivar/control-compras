'use client'

import { AlertCircle, CheckCircle2, Clock, Info, Trash2, Search } from 'lucide-react'
import { useState } from 'react'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  description: string
  expediente: string
  date: string
  actionRequired: boolean
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Aprobación Pendiente Urgente',
    description: 'EXP-2026-0051 requiere aprobación gerencial antes de las 17:00 horas',
    expediente: 'EXP-2026-0051',
    date: 'Hoy 14:30',
    actionRequired: true,
  },
  {
    id: '2',
    type: 'critical',
    title: 'Validación Legal Requerida',
    description: 'Tres expedientes aguardan validación legal. Tiempo promedio: 2.5 horas',
    expediente: 'EXP-2026-0050, EXP-2026-0049, EXP-2026-0048',
    date: 'Hoy 13:15',
    actionRequired: true,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Expediente Próximo a Vencer',
    description: 'EXP-2026-0047 alcanzará el límite de 5 días de procesamiento en 8 horas',
    expediente: 'EXP-2026-0047',
    date: 'Hoy 12:45',
    actionRequired: false,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Error de Validación Detectado',
    description: 'Campo "Partida Presupuestaria" incorrecto en EXP-2026-0046. Requiere corrección',
    expediente: 'EXP-2026-0046',
    date: 'Hoy 11:20',
    actionRequired: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Actualización del Sistema',
    description: 'Nueva versión de módulo de Auditoría disponible. Descarga automática programada para esta noche',
    expediente: 'Sistema',
    date: 'Hoy 10:00',
    actionRequired: false,
  },
  {
    id: '6',
    type: 'success',
    title: 'Lote Procesado Exitosamente',
    description: '12 expedientes completaron ciclo de validación. Tasa de error: 0%',
    expediente: 'Lote-2026-MAY-19',
    date: 'Ayer 16:45',
    actionRequired: false,
  },
]

const alertConfig = {
  critical: { 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  warning: { 
    icon: Clock, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800'
  },
  info: { 
    icon: Info, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800'
  },
  success: { 
    icon: CheckCircle2, 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800'
  },
}

export default function AlertsView() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAlerts = (filter === 'all' ? alerts : alerts.filter(a => a.type === filter))
    .filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.expediente.toLowerCase().includes(searchQuery.toLowerCase())
    )
  const criticalCount = alerts.filter(a => a.type === 'critical').length
  const warningCount = alerts.filter(a => a.type === 'warning').length

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por título, descripción o expediente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <p className="text-sm font-bold text-red-700 uppercase tracking-wide">Alertas Críticas</p>
          <p className="text-4xl font-bold text-red-600 mt-3">{criticalCount}</p>
          <p className="text-xs text-red-600 mt-2 font-semibold">Acción inmediata requerida</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-wide">Advertencias</p>
          <p className="text-4xl font-bold text-amber-600 mt-3">{warningCount}</p>
          <p className="text-xs text-amber-600 mt-2 font-semibold">Monitoreo recomendado</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Total de Alertas</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">{alerts.length}</p>
          <p className="text-xs text-blue-600 mt-2 font-semibold">En los últimos 2 días</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'critical', 'warning', 'info', 'success'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-border'
            }`}
          >
            {type === 'all' && 'Todas'}
            {type === 'critical' && `Críticas (${alerts.filter(a => a.type === 'critical').length})`}
            {type === 'warning' && `Advertencias (${alerts.filter(a => a.type === 'warning').length})`}
            {type === 'info' && `Información (${alerts.filter(a => a.type === 'info').length})`}
            {type === 'success' && `Exitosas (${alerts.filter(a => a.type === 'success').length})`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => {
          const config = alertConfig[alert.type]
          const Icon = config.icon
          
          return (
            <div
              key={alert.id}
              className={`border rounded-xl p-5 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-left duration-500 hover:shadow-lg hover:-translate-y-1 transition-all ${config.bg} ${config.border} bg-gray-50`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4 flex-1">
                <div className={`${config.bg} p-2.5 rounded-lg flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm">{alert.title}</h3>
                    {alert.actionRequired && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badge}`}>
                        Acción Requerida
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">{alert.expediente}</span>
                    <span>{alert.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="flex-shrink-0 p-2 hover:bg-border rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">Sin alertas</p>
          <p className="text-sm text-muted-foreground">No hay alertas en esta categoría</p>
        </div>
      )}
    </div>
  )
}
