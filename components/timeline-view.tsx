'use client'

import { CheckCircle2, Clock, AlertCircle, FileText, Search } from 'lucide-react'
import { useState } from 'react'

interface TimelineEvent {
  id: string
  expediente: string
  status: 'completed' | 'in-progress' | 'pending' | 'rejected'
  title: string
  description: string
  date: string
  time: string
  user: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    expediente: 'EXP-2026-0042',
    status: 'completed',
    title: 'Validación Legal Completada',
    description: 'El expediente ha sido validado y aprobado por consultoría jurídica',
    date: '19 May 2026',
    time: '14:32',
    user: 'Abogado Senior - Dr. Carlos Martínez',
  },
  {
    id: '2',
    expediente: 'EXP-2026-0041',
    status: 'in-progress',
    title: 'Evaluación en Progreso',
    description: 'Análisis preliminar de incidencia en curso',
    date: '19 May 2026',
    time: '11:15',
    user: 'Analista de Cumplimiento - María López',
  },
  {
    id: '3',
    expediente: 'EXP-2026-0040',
    status: 'completed',
    title: 'Registro Ingresado',
    description: 'Captura de datos inicial completada con asignación de código único',
    date: '18 May 2026',
    time: '09:45',
    user: 'Operador Sistema - Juan Pérez',
  },
  {
    id: '4',
    expediente: 'EXP-2026-0039',
    status: 'completed',
    title: 'Cierre y Auditoría',
    description: 'Resolución completada. Reporte ejecutivo generado. Registro bloqueado inmutablemente',
    date: '17 May 2026',
    time: '16:22',
    user: 'Auditor - Rosa García',
  },
  {
    id: '5',
    expediente: 'EXP-2026-0038',
    status: 'pending',
    title: 'Pendiente de Aprobación',
    description: 'Esperando aprobación de dirección',
    date: '16 May 2026',
    time: '13:50',
    user: 'Sistema',
  },
  {
    id: '6',
    expediente: 'EXP-2026-0037',
    status: 'rejected',
    title: 'Requiere Correcciones',
    description: 'Se encontraron inconsistencias. Se requiere re-evaluación',
    date: '15 May 2026',
    time: '10:30',
    user: 'Revisor Control - Luis Rivas',
  },
]

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Completado' },
  'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'En Progreso' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pendiente' },
  rejected: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rechazado' },
}

export default function TimelineView() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = timelineEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.expediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Timeline de Trazabilidad</h2>
        <p className="text-sm text-gray-600 mt-2">Historial completo e inmutable de procesos</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por expediente, título, descripción o usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-300">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">Sin resultados</p>
            <p className="text-sm text-muted-foreground">No se encontraron eventos con los criterios de búsqueda</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => {
          const config = statusConfig[event.status]
          const Icon = config.icon
          
          return (
            <div key={event.id} className="relative animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-4">
                {/* Timeline Connector */}
                <div className="flex flex-col items-center">
                  <div className={`${config.bg} p-2.5 rounded-full`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                  )}
                </div>

                {/* Event Card */}
                <div className="flex-1 pb-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {event.expediente}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${config.bg} text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2">{event.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">{event.date}</p>
                        <p className="text-xs text-gray-600">{event.time}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{event.description}</p>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-300">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600">{event.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          })
        )}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm">
          Cargar Más Eventos
        </button>
      </div>
    </div>
  )
}
