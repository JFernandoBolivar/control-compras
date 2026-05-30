'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Calendar, ArrowLeft, Search } from 'lucide-react'
import ExpedienteDocuments from './expediente-documents'
import RequisitosVigencias from './requisitos-vigencias'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface Expediente {
  id: string
  numero: string
  unidad: string
  objeto: string
  monto: number
  proveedor: string
  fecha: string
}

interface ExpedienteDetalleViewProps {
  onBack: () => void
}

export default function ExpedienteDetalleView({ onBack }: ExpedienteDetalleViewProps) {
  const [expedientes, setExpedientes] = useLocalStorage<Expediente[]>('expedientes-list', [
    {
      id: '1',
      numero: 'EXP-2026-0051',
      unidad: 'Despacho del Ministro',
      objeto: 'Suministro de equipos de cómputo',
      monto: 45000,
      proveedor: 'TechSolutions C.A.',
      fecha: '2026-05-19',
    },
    {
      id: '2',
      numero: 'EXP-2026-0052',
      unidad: 'Viceministerio de Política Interior',
      objeto: 'Servicio de mantenimiento de servidores',
      monto: 25000,
      proveedor: 'InfraTech Inc.',
      fecha: '2026-05-18',
    },
  ])

  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('documentos')

  const filteredExpedientes = expedientes.filter(
    exp =>
      exp.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.proveedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.objeto.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedExpediente) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
        {/* Header con botón atrás */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedExpediente(null)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{selectedExpediente.numero}</h2>
            <p className="text-sm text-slate-500">{selectedExpediente.objeto}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Unidad Usuaria</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{selectedExpediente.unidad}</p>
          </div>
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Proveedor</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{selectedExpediente.proveedor}</p>
          </div>
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Monto (Bs.)</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{selectedExpediente.monto.toLocaleString('es-VE')}</p>
          </div>
          <div className="bg-slate-100 rounded-xl border border-slate-300 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Fecha</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {new Date(selectedExpediente.fecha).toLocaleDateString('es-VE')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-200 border border-slate-300">
            <TabsTrigger value="documentos" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="vigencias" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Vigencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documentos" className="mt-6">
            <ExpedienteDocuments expedienteId={selectedExpediente.id} />
          </TabsContent>

          <TabsContent value="vigencias" className="mt-6">
            <RequisitosVigencias expedienteId={selectedExpediente.id} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-slate-800">Gestor de Documentos y Vigencias</h2>
      </div>

      <p className="text-slate-600">
        Selecciona un expediente para gestionar sus documentos y monitorear las vigencias de requisitos.
      </p>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por número de expediente, proveedor u objeto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
        />
      </div>

      {/* Expedientes Grid */}
      {filteredExpedientes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No se encontraron expedientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpedientes.map(expediente => (
            <button
              key={expediente.id}
              onClick={() => setSelectedExpediente(expediente)}
              className="text-left bg-white border border-slate-300 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {expediente.numero}
                </h3>
                <div className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  Ver detalles
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{expediente.objeto}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Proveedor:</span>
                  <span className="font-medium text-slate-800">{expediente.proveedor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monto:</span>
                  <span className="font-medium text-slate-800">Bs. {expediente.monto.toLocaleString('es-VE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(expediente.fecha).toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <p className="text-sm text-blue-900 font-medium mb-2">Características disponibles:</p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Carga de documentos esenciales (órdenes, presupuestos, actas, etc.)</li>
          <li>Monitoreo de vigencias de RIF, RUC, certificaciones y registros</li>
          <li>Alertas automáticas para requisitos próximos a vencer</li>
          <li>Todos los datos se guardan en memoria local (localStorage)</li>
          <li>Gestión independiente por expediente</li>
        </ul>
      </div>
    </div>
  )
}
