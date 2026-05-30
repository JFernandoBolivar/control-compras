'use client'

import { useState } from 'react'
import { FileText, Check, X } from 'lucide-react'

interface FormData {
  tipoTramite: string
  numeroOrden: string
  fecha: string
  unidad: string
  puntoCuenta: string
  objeto: string
  rifLetra: string
  rifNumero: string
  razonSocial: string
  monto: string
  partida: string
  modalidad: string
}

interface SubmissionResult {
  success: boolean
  message: string
  expediente: string
}

export default function ExpedientesView() {
  const [formData, setFormData] = useState<FormData>({
    tipoTramite: '',
    numeroOrden: '',
    fecha: new Date().toISOString().split('T')[0],
    unidad: '',
    puntoCuenta: '',
    objeto: '',
    rifLetra: 'J',
    rifNumero: '',
    razonSocial: '',
    monto: '',
    partida: '',
    modalidad: '',
  })

  const [submitted, setSubmitted] = useState<SubmissionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de envío
    setTimeout(() => {
      setSubmitted({
        success: true,
        message: 'Expediente registrado exitosamente en el sistema',
        expediente: `EXP-2026-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      })
      setFormData({
        tipoTramite: '',
        numeroOrden: '',
        fecha: new Date().toISOString().split('T')[0],
        unidad: '',
        puntoCuenta: '',
        objeto: '',
        rifLetra: 'J',
        rifNumero: '',
        razonSocial: '',
        monto: '',
        partida: '',
        modalidad: '',
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Gestión de Expedientes</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl bg-white rounded-lg border border-border shadow-sm p-6">
        {/* Success Message */}
        {submitted && submitted.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">{submitted.message}</p>
              <p className="text-sm text-green-800 mt-1">Número de Control: <span className="font-mono font-bold">{submitted.expediente}</span></p>
              <p className="text-xs text-green-700 mt-2">El expediente ha sido ingresado al workflow de evaluación. Hash de trazabilidad asignado automáticamente.</p>
            </div>
          </div>
        )}

        {/* Section 1: Datos Identificativos */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 pb-2 border-b border-border flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
            Datos Identificativos del Trámite
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Tipo de Trámite <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoTramite"
                value={formData.tipoTramite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Seleccione...</option>
                <option value="compra">Orden de Compra (Bienes)</option>
                <option value="servicio">Orden de Servicio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Número de Orden <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground font-mono text-sm flex items-center">
                  {formData.tipoTramite === 'compra' ? 'OC-' : 'OS-'}
                </div>
                <input
                  type="text"
                  name="numeroOrden"
                  value={formData.numeroOrden}
                  onChange={handleChange}
                  required
                  placeholder="2026-0001"
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Fecha de Ingreso <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Unidad Usuaria <span className="text-red-500">*</span>
              </label>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Seleccione la dependencia...</option>
                <option value="despacho">Despacho del Ministro</option>
                <option value="viceministerio1">Viceministerio de Política Interior</option>
                <option value="viceministerio2">Viceministerio de Prevención y Seguridad</option>
                <option value="ti">Dirección General de Tecnología</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Punto de Cuenta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="puntoCuenta"
                value={formData.puntoCuenta}
                onChange={handleChange}
                required
                placeholder="DM-045-2026"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-1">
                Objeto de la Contratación <span className="text-red-500">*</span>
              </label>
              <textarea
                name="objeto"
                value={formData.objeto}
                onChange={handleChange}
                required
                placeholder="Descripción breve de los bienes o servicios..."
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Proveedor */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 pb-2 border-b border-border flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</span>
            Datos del Contratista
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                RIF <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="rifLetra"
                  value={formData.rifLetra}
                  onChange={handleChange}
                  className="w-20 px-2 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>J</option>
                  <option>V</option>
                  <option>E</option>
                  <option>G</option>
                </select>
                <input
                  type="text"
                  name="rifNumero"
                  value={formData.rifNumero}
                  onChange={handleChange}
                  required
                  placeholder="12345678-9"
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required
                placeholder="Nombre legal de la empresa"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Datos Financieros */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 pb-2 border-b border-border flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">3</span>
            Datos Financieros y Presupuestarios
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Partida Presupuestaria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="partida"
                value={formData.partida}
                onChange={handleChange}
                required
                placeholder="4.02.00.00.00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Monto Base (Bs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                required
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Modalidad <span className="text-red-500">*</span>
              </label>
              <select
                name="modalidad"
                value={formData.modalidad}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Seleccione...</option>
                <option value="directa">Adjudicación Directa</option>
                <option value="abierto">Concurso Abierto</option>
                <option value="cerrado">Concurso Cerrado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setFormData({
              tipoTramite: '',
              numeroOrden: '',
              fecha: new Date().toISOString().split('T')[0],
              unidad: '',
              puntoCuenta: '',
              objeto: '',
              rifLetra: 'J',
              rifNumero: '',
              razonSocial: '',
              monto: '',
              partida: '',
              modalidad: '',
            })}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Procesando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Registrar Expediente
              </>
            )}
          </button>
        </div>
      </form>

      {/* Form Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Notas Importantes
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Todos los campos marcados con * son obligatorios</li>
          <li>El sistema validará automáticamente la duplicidad de números de orden</li>
          <li>Los datos del proveedor se pre-cargarán si existe en la base de datos</li>
          <li>Se asignará automáticamente un Hash de Trazabilidad al guardar</li>
          <li>El expediente ingresará inmediatamente al workflow de evaluación</li>
        </ul>
      </div>
    </div>
  )
}
