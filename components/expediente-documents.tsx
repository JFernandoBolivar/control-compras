'use client'

import { useState } from 'react'
import { FileText, Upload, Download, Trash2, CheckCircle2, Clock, AlertCircle, File, X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface Document {
  id: string
  name: string
  type: 'oficio' | 'presupuesto' | 'orden' | 'entrega' | 'acta' | 'otro'
  fileName: string
  uploadDate: string
  expedienteId: string
}

const documentTypes = [
  { id: 'oficio', label: 'Oficio de Requisición', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'presupuesto', label: 'Presupuesto del Proveedor', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'orden', label: 'Orden de Compra/Servicio', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'entrega', label: 'Nota de Entrega', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'acta', label: 'Acta de Recepción/Conformidad', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'otro', label: 'Otros Documentos', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
]

interface ExpedienteDocumentsProps {
  expedienteId: string
}

export default function ExpedienteDocuments({ expedienteId }: ExpedienteDocumentsProps) {
  const [documents, setDocuments] = useLocalStorage<Document[]>(`docs-${expedienteId}`, [])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      // Simulación de carga
      setTimeout(() => {
        const newDocument: Document = {
          id: `${Date.now()}`,
          name: documentTypes.find(d => d.id === type)?.label || 'Documento',
          type: type as Document['type'],
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          expedienteId,
        }
        setDocuments([...documents, newDocument])
        setIsLoading(false)
      }, 800)
    }
  }

  const handleDelete = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId))
  }

  const getTypeConfig = (typeId: string) => {
    return documentTypes.find(d => d.id === typeId)
  }

  const documentsByType = documentTypes.map(type => ({
    ...type,
    documents: documents.filter(d => d.type === type.id),
  }))

  const completedRequired = ['oficio', 'presupuesto', 'orden', 'acta'].filter(
    type => documents.some(d => d.type === type as Document['type'])
  ).length

  const totalRequired = 4

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Documentos del Expediente
          </h3>
          <p className="text-sm text-slate-500 mt-1">Carga los documentos requeridos para completar el proceso</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{completedRequired}/{totalRequired}</div>
          <div className="text-xs text-slate-500">Documentos Esenciales</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-300">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${(completedRequired / totalRequired) * 100}%` }}
        ></div>
      </div>

      {/* Document Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentsByType.map((docType) => {
          const hasDocuments = docType.documents.length > 0
          const Icon = docType.icon

          return (
            <div
              key={docType.id}
              className={`rounded-xl border-2 transition-all ${
                hasDocuments
                  ? `${docType.bg} border-dashed border-slate-400 bg-opacity-30`
                  : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <label className="p-5 cursor-pointer block">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${docType.bg}`}>
                    <Icon className={`w-5 h-5 ${docType.color}`} />
                  </div>
                  {hasDocuments && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>

                <h4 className="font-semibold text-slate-800 mb-1 text-sm">{docType.label}</h4>

                {hasDocuments ? (
                  <div className="space-y-2">
                    {docType.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between gap-2 text-xs bg-white/70 rounded p-2">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <File className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate text-slate-700">{doc.fileName}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(doc.id)
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    <p className="mb-3">Haz clic para cargar</p>
                    <div className="flex items-center gap-1 text-slate-400 justify-center py-2 rounded border border-dashed border-slate-300">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Selecciona archivo</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, docType.id)}
                  disabled={isLoading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png,.xls,.xlsx"
                />
              </label>
            </div>
          )
        })}
      </div>

      {/* Recent Documents Summary */}
      {documents.length > 0 && (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-5">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Documentos Cargados ({documents.length})
          </h4>
          <div className="space-y-2">
            {documents.map(doc => {
              const docType = getTypeConfig(doc.type)
              const uploadDate = new Date(doc.uploadDate)
              return (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded ${docType?.bg}`}>
                      <File className={`w-4 h-4 ${docType?.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{doc.fileName}</p>
                      <p className="text-xs text-slate-500">{docType?.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 font-medium">
                      {uploadDate.toLocaleDateString('es-VE', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-400">
                      {uploadDate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4" />
          Documentos Esenciales
        </p>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Oficio de Requisición de la Unidad Usuaria</li>
          <li>Presupuesto del proveedor seleccionado o ganador</li>
          <li>Orden de Compra / Servicio</li>
          <li>Acta de Recepción o Conformidad de Buena Ejecución</li>
        </ul>
      </div>
    </div>
  )
}
