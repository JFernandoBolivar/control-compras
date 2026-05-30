'use client'

import { useState } from 'react'
import { Calendar, AlertTriangle, CheckCircle2, Clock, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface Requirement {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'vigente' | 'proximo' | 'vencido'
  category: 'ruc' | 'rif' | 'certificacion' | 'registro' | 'otro'
  notes: string
  expedienteId: string
}

const categories = [
  { id: 'ruc', label: 'Registro Único de Contribuyentes (RUC)', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'rif', label: 'Registro Federal de Impuestos (RIF)', color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'certificacion', label: 'Certificación Bancaria', color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'registro', label: 'Registro Nacional de Contrataciones (RNC)', color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'otro', label: 'Otros Requisitos', color: 'text-slate-600', bg: 'bg-slate-100' },
]

interface RequisitosVigenciasProps {
  expedienteId: string
}

export default function RequisitosVigencias({ expedienteId }: RequisitosVigenciasProps) {
  const [requirements, setRequirements] = useLocalStorage<Requirement[]>(
    `reqs-${expedienteId}`,
    []
  )
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Requirement>>({
    name: '',
    description: '',
    dueDate: '',
    category: 'otro',
    notes: '',
  })

  const getStatusColor = (status: Requirement['status']) => {
    switch (status) {
      case 'vigente':
        return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Vigente' }
      case 'proximo':
        return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Próximo a Vencer' }
      case 'vencido':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Vencido' }
    }
  }

  const getRequirementStatus = (dueDate: string): Requirement['status'] => {
    const due = new Date(dueDate)
    const today = new Date()
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilDue < 0) return 'vencido'
    if (daysUntilDue <= 15) return 'proximo'
    return 'vigente'
  }

  const getCategoryConfig = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)
  }

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.dueDate) {
      alert('Por favor completa el nombre y fecha de vencimiento')
      return
    }

    const status = getRequirementStatus(formData.dueDate)

    if (editingId) {
      setRequirements(
        requirements.map(req =>
          req.id === editingId
            ? { ...req, ...formData, status, expedienteId }
            : req
        )
      )
      setEditingId(null)
    } else {
      const newReq: Requirement = {
        id: `${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        dueDate: formData.dueDate || '',
        category: (formData.category || 'otro') as Requirement['category'],
        notes: formData.notes || '',
        status,
        expedienteId,
      }
      setRequirements([...requirements, newReq])
    }

    setFormData({ name: '', description: '', dueDate: '', category: 'otro', notes: '' })
    setIsAddingNew(false)
  }

  const handleEdit = (req: Requirement) => {
    setFormData(req)
    setEditingId(req.id)
    setIsAddingNew(true)
  }

  const handleDelete = (id: string) => {
    setRequirements(requirements.filter(req => req.id !== id))
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({ name: '', description: '', dueDate: '', category: 'otro', notes: '' })
  }

  // Revalidar estados
  const updatedRequirements = requirements.map(req => ({
    ...req,
    status: getRequirementStatus(req.dueDate),
  }))

  const statsByStatus = {
    vigente: updatedRequirements.filter(r => r.status === 'vigente').length,
    proximo: updatedRequirements.filter(r => r.status === 'proximo').length,
    vencido: updatedRequirements.filter(r => r.status === 'vencido').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            Requisitos y Vigencias
          </h3>
          <p className="text-sm text-slate-500 mt-1">Monitorea fechas de vencimiento de RIF, RUC, certificaciones, etc.</p>
        </div>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Requisito
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4">
          <p className="text-sm text-emerald-700 font-medium mb-1">Vigentes</p>
          <p className="text-3xl font-bold text-emerald-600">{statsByStatus.vigente}</p>
        </div>
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <p className="text-sm text-amber-700 font-medium mb-1">Próximos a Vencer</p>
          <p className="text-3xl font-bold text-amber-600">{statsByStatus.proximo}</p>
        </div>
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-sm text-red-700 font-medium mb-1">Vencidos</p>
          <p className="text-3xl font-bold text-red-600">{statsByStatus.vencido}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 space-y-4">
          <h4 className="font-semibold text-slate-800">
            {editingId ? 'Editar Requisito' : 'Nuevo Requisito'}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Requisito <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: RIF del Proveedor"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalles adicionales..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha de Vencimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category || 'otro'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Requirement['category'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notas
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observaciones importantes..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-300">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirements List */}
      {updatedRequirements.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No hay requisitos registrados</p>
          <p className="text-sm text-slate-500 mt-1">Agrega requisitos para monitorear sus vigencias</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updatedRequirements.map(req => {
            const statusConfig = getStatusColor(req.status)
            const categoryConfig = getCategoryConfig(req.category)
            const StatusIcon = statusConfig.icon
            const dueDate = new Date(req.dueDate)
            const today = new Date()
            const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <div
                key={req.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  req.status === 'vencido'
                    ? 'border-red-300 bg-red-50'
                    : req.status === 'proximo'
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-emerald-300 bg-emerald-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{req.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{categoryConfig?.label}</p>
                      </div>
                    </div>

                    {req.description && (
                      <p className="text-sm text-slate-700 ml-11 mb-2">{req.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 items-center ml-11">
                      <div className="text-sm">
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {daysRemaining < 0
                            ? `Vencido hace ${Math.abs(daysRemaining)} días`
                            : `${daysRemaining} días restantes`}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600">
                        Vence: {dueDate.toLocaleDateString('es-VE', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-slate-600 ml-11 mt-2 italic">{req.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(req)}
                      className="p-2 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900 font-medium flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          Requisitos Comunes a Monitorear
        </p>
        <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
          <li>Registro Nacional de Contrataciones (RNC)</li>
          <li>RIF (Registro Federal de Impuestos)</li>
          <li>Certificación Bancaria</li>
          <li>Documentos de Constitución y Poderes</li>
          <li>Licencias y Permisos Especiales</li>
        </ul>
      </div>
    </div>
  )
}
