'use client';

import React, { useState, createContext, useContext } from 'react';
import {
  LayoutDashboard, Clock, Bell, FileText, BarChart3, AlertCircle, AlertTriangle,
  CheckCircle2, Info, Trash2, Search, TrendingUp, Users, Check, X, Menu, Calendar, LogOut,
  Upload, Eye, FileCheck, CreditCard, ClipboardList, Shuffle, Plus, ChevronDown
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/auth-context';
import LoginView from '@/components/login-view';

// --- TIPOS Y ESTADOS ---

type ExpedienteEstado =
  | 'ValidacionLegalPendiente'
  | 'DocumentacionPendiente'
  | 'ListoParaAprobacion'
  | 'Aprobado'
  | 'RecepcionBienesServicios'
  | 'Pagado'
  | 'Registrado';

interface Expediente {
  id: string;
  tipo: 'compra' | 'servicio';
  numeroOrden: string;
  fechaIngreso: string;
  unidadUsuaria: string;
  puntoCuenta: string;
  objeto: string;
  rif: string;
  razonSocial: string;
  partida: string;
  monto: number;
  modalidad: string;
  estado: ExpedienteEstado;
  creadoPor: string;
  documentos: string[];
  precioReferencia: number;
  timeline: { fecha: string; evento: string; usuario: string }[];
}

interface Incidencia {
  id: string;
  expedienteId: string;
  descripcion: string;
  estado: 'abierta' | 'en_proceso' | 'cerrada';
  fechaCreacion: string;
  asignadoA: string;
}

// --- CONTEXTO DE EXPEDIENTES ---

interface ExpedientesContextType {
  expedientes: Expediente[];
  incidencias: Incidencia[];
  agregarExpediente: (exp: Omit<Expediente, 'id' | 'estado' | 'timeline' | 'documentos'>) => void;
  actualizarEstado: (id: string, nuevoEstado: ExpedienteEstado, comentario?: string) => void;
  agregarDocumento: (id: string, documento: string) => void;
  actualizarIncidencia: (id: string, nuevoEstado: Incidencia['estado']) => void;
}

const ExpedientesContext = createContext<ExpedientesContextType | undefined>(undefined);

const documentosRequeridos = [
  'oficio_requisicion.pdf',
  'conformidad_buena_ejecicion.pdf',
  
  'orden_compra_servicio.pdf',
  'registro_compromiso.pdf',
  
  'presupuesto.pdf',
  'registro_causado.pdf'
  'nota_entrega.pdf',

  
  
  

];

// --- MOCK DATA INICIAL ---

const expedientesIniciales: Expediente[] = [
  {
    id: 'EXP-2026-0001',
    tipo: 'compra',
    numeroOrden: 'OC-2026-0001',
    fechaIngreso: '2026-05-10',
    unidadUsuaria: 'Dirección General de Tecnología',
    puntoCuenta: 'DM-045-2026',
    objeto: 'Adquisición de equipos de computación',
    rif: 'J-12345678-9',
    razonSocial: 'Tech Solutions C.A.',
    partida: '4.02.00.00.00',
    monto: 150000,
    modalidad: 'Adjudicación Directa',
    estado: 'ValidacionLegalPendiente',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf'],
    precioReferencia: 140000,
    timeline: [{ fecha: '2026-05-10 09:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' }]
  },
  {
    id: 'EXP-2026-0002',
    tipo: 'servicio',
    numeroOrden: 'OS-2026-0002',
    fechaIngreso: '2026-05-11',
    unidadUsuaria: 'Despacho del Ministro',
    puntoCuenta: 'DM-046-2026',
    objeto: 'Servicio de mantenimiento de aires acondicionados',
    rif: 'J-98765432-1',
    razonSocial: 'Clima Perfecto C.A.',
    partida: '4.03.00.00.00',
    monto: 85000,
    modalidad: 'Concurso Abierto',
    estado: 'ValidacionLegalPendiente',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf'],
    precioReferencia: 80000,
    timeline: [{ fecha: '2026-05-11 10:30', evento: 'Expediente creado', usuario: 'Carlos Méndez' }]
  },
  {
    id: 'EXP-2026-0003',
    tipo: 'compra',
    numeroOrden: 'OC-2026-0003',
    fechaIngreso: '2026-05-08',
    unidadUsuaria: 'Dirección de Administración',
    puntoCuenta: 'DM-042-2026',
    objeto: 'Compra de mobiliario de oficina',
    rif: 'J-11223344-5',
    razonSocial: 'Muebles Express C.A.',
    partida: '4.02.01.00.00',
    monto: 220000,
    modalidad: 'Adjudicación Directa',
    estado: 'DocumentacionPendiente',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf'],
    precioReferencia: 200000,
    timeline: [
      { fecha: '2026-05-08 08:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-05-09 14:00', evento: 'Validación legal completada', usuario: 'María López' }
    ]
  },
  {
    id: 'EXP-2026-0004',
    tipo: 'servicio',
    numeroOrden: 'OS-2026-0004',
    fechaIngreso: '2026-05-05',
    unidadUsuaria: 'Dirección General de Tecnología',
    puntoCuenta: 'DM-040-2026',
    objeto: 'Servicio de soporte técnico anual',
    rif: 'J-55667788-9',
    razonSocial: 'IT Support Venezuela C.A.',
    partida: '4.03.02.00.00',
    monto: 350000,
    modalidad: 'Concurso Abierto',
    estado: 'ListoParaAprobacion',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf', 'nota_entrega.pdf'],
    precioReferencia: 300000,
    timeline: [
      { fecha: '2026-05-05 09:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-05-06 11:00', evento: 'Validación legal completada', usuario: 'María López' },
      { fecha: '2026-05-07 15:00', evento: 'Documentación verificada', usuario: 'María López' }
    ]
  },
  {
    id: 'EXP-2026-0005',
    tipo: 'compra',
    numeroOrden: 'OC-2026-0005',
    fechaIngreso: '2026-05-01',
    unidadUsuaria: 'Despacho del Ministro',
    puntoCuenta: 'DM-035-2026',
    objeto: 'Adquisición de vehículos oficiales',
    rif: 'J-99887766-5',
    razonSocial: 'Autos Premium C.A.',
    partida: '4.04.00.00.00',
    monto: 1500000,
    modalidad: 'Concurso Abierto',
    estado: 'Aprobado',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf', 'nota_entrega.pdf'],
    precioReferencia: 1400000,
    timeline: [
      { fecha: '2026-05-01 08:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-05-02 10:00', evento: 'Validación legal completada', usuario: 'María López' },
      { fecha: '2026-05-03 14:00', evento: 'Documentación verificada', usuario: 'María López' },
      { fecha: '2026-05-04 16:00', evento: 'Expediente aprobado', usuario: 'José Rodríguez' }
    ]
  },
  {
    id: 'EXP-2026-0006',
    tipo: 'servicio',
    numeroOrden: 'OS-2026-0006',
    fechaIngreso: '2026-04-25',
    unidadUsuaria: 'Dirección de Administración',
    puntoCuenta: 'DM-030-2026',
    objeto: 'Servicio de limpieza institucional',
    rif: 'J-44556677-8',
    razonSocial: 'Limpieza Total C.A.',
    partida: '4.03.05.00.00',
    monto: 180000,
    modalidad: 'Adjudicación Directa',
    estado: 'RecepcionBienesServicios',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf', 'nota_entrega.pdf', 'acta_recepcion.pdf'],
    precioReferencia: 170000,
    timeline: [
      { fecha: '2026-04-25 09:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-04-26 11:00', evento: 'Validación legal completada', usuario: 'María López' },
      { fecha: '2026-04-27 14:00', evento: 'Documentación verificada', usuario: 'María López' },
      { fecha: '2026-04-28 10:00', evento: 'Expediente aprobado', usuario: 'José Rodríguez' },
      { fecha: '2026-04-29 15:00', evento: 'Acta de recepción adjuntada', usuario: 'Ana Martínez' }
    ]
  },
  {
    id: 'EXP-2026-0007',
    tipo: 'compra',
    numeroOrden: 'OC-2026-0007',
    fechaIngreso: '2026-04-20',
    unidadUsuaria: 'Dirección General de Tecnología',
    puntoCuenta: 'DM-025-2026',
    objeto: 'Compra de licencias de software',
    rif: 'J-33445566-7',
    razonSocial: 'Software Legal C.A.',
    partida: '4.02.03.00.00',
    monto: 95000,
    modalidad: 'Adjudicación Directa',
    estado: 'Pagado',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf', 'nota_entrega.pdf', 'acta_recepcion.pdf'],
    precioReferencia: 90000,
    timeline: [
      { fecha: '2026-04-20 08:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-04-21 10:00', evento: 'Validación legal completada', usuario: 'María López' },
      { fecha: '2026-04-22 12:00', evento: 'Documentación verificada', usuario: 'María López' },
      { fecha: '2026-04-23 14:00', evento: 'Expediente aprobado', usuario: 'José Rodríguez' },
      { fecha: '2026-04-24 09:00', evento: 'Acta de recepción adjuntada', usuario: 'Ana Martínez' },
      { fecha: '2026-04-25 16:00', evento: 'Pago registrado', usuario: 'Ana Martínez' }
    ]
  },
  {
    id: 'EXP-2026-0008',
    tipo: 'compra',
    numeroOrden: 'OC-2026-0008',
    fechaIngreso: '2026-05-12',
    unidadUsuaria: 'Dirección de Administración',
    puntoCuenta: 'DM-048-2026',
    objeto: 'Compra de insumos médicos',
    rif: 'J-77889900-1',
    razonSocial: 'Salud Express C.A.',
    partida: '4.02.05.00.00',
    monto: 450000,
    modalidad: 'Concurso Abierto',
    estado: 'ListoParaAprobacion',
    creadoPor: '1',
    documentos: ['oficio_requisicion.pdf', 'presupuesto.pdf', 'orden_compra_servicio.pdf', 'nota_entrega.pdf'],
    precioReferencia: 320000, // Desviación de precio > 20%
    timeline: [
      { fecha: '2026-05-12 09:00', evento: 'Expediente creado', usuario: 'Carlos Méndez' },
      { fecha: '2026-05-13 11:00', evento: 'Validación legal completada', usuario: 'María López' },
      { fecha: '2026-05-14 14:00', evento: 'Documentación verificada', usuario: 'María López' }
    ]
  }
];

const incidenciasIniciales: Incidencia[] = [
  { id: 'INC-001', expedienteId: 'EXP-2026-0003', descripcion: 'Falta firma del director en oficio de requisición', estado: 'abierta', fechaCreacion: '2026-05-09', asignadoA: 'María López' },
  { id: 'INC-002', expedienteId: 'EXP-2026-0004', descripcion: 'Diferencia de montos entre presupuesto y orden', estado: 'en_proceso', fechaCreacion: '2026-05-07', asignadoA: 'María López' },
  { id: 'INC-003', expedienteId: 'EXP-2026-0001', descripcion: 'RIF del proveedor no coincide con registro', estado: 'abierta', fechaCreacion: '2026-05-11', asignadoA: 'María López' },
  { id: 'INC-004', expedienteId: 'EXP-2026-0007', descripcion: 'Documentación incompleta subsanada', estado: 'cerrada', fechaCreacion: '2026-04-22', asignadoA: 'María López' },
];

// --- ALERTAS MOCK ---

const alertasMock = [
  { id: '1', type: 'critical', title: 'Expediente requiere aprobación urgente', description: 'EXP-2026-0004 lleva 3 días pendiente de aprobación', expediente: 'EXP-2026-0004', date: 'Hoy 10:00' },
  { id: '2', type: 'warning', title: 'Desviación de precio detectada', description: 'EXP-2026-0008 tiene una desviación de precio superior al 20%', expediente: 'EXP-2026-0008', date: 'Hoy 09:30' },
  { id: '3', type: 'info', title: 'Expediente completado', description: 'EXP-2026-0007 ha completado todo el ciclo de pago', expediente: 'EXP-2026-0007', date: 'Ayer 16:00' },
];

// --- PROVIDER ---

function ExpedientesProvider({ children }: { children: React.ReactNode }) {
  const [expedientes, setExpedientes] = useState<Expediente[]>(expedientesIniciales);
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales);

  const agregarExpediente = (exp: Omit<Expediente, 'id' | 'estado' | 'timeline' | 'documentos'>) => {
    const nuevoId = `EXP-2026-${String(expedientes.length + 1).padStart(4, '0')}`;
    const nuevoExpediente: Expediente = {
      ...exp,
      id: nuevoId,
      estado: 'ValidacionLegalPendiente',
      documentos: [],
      timeline: [{ fecha: new Date().toISOString().slice(0, 16).replace('T', ' '), evento: 'Expediente creado', usuario: exp.razonSocial }]
    };
    setExpedientes(prev => [...prev, nuevoExpediente]);
  };

  const actualizarEstado = (id: string, nuevoEstado: ExpedienteEstado, comentario?: string) => {
    setExpedientes(prev => prev.map(exp => {
      if (exp.id === id) {
        const eventoTexto = comentario
          ? `Estado cambiado a ${nuevoEstado}: ${comentario}`
          : `Estado cambiado a ${nuevoEstado}`;
        return {
          ...exp,
          estado: nuevoEstado,
          timeline: [...exp.timeline, {
            fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
            evento: eventoTexto,
            usuario: 'Sistema'
          }]
        };
      }
      return exp;
    }));
  };

  const agregarDocumento = (id: string, documento: string) => {
    setExpedientes(prev => prev.map(exp => {
      if (exp.id === id) {
        return {
          ...exp,
          documentos: [...exp.documentos, documento],
          timeline: [...exp.timeline, {
            fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
            evento: `Documento agregado: ${documento}`,
            usuario: 'Sistema'
          }]
        };
      }
      return exp;
    }));
  };

  const actualizarIncidencia = (id: string, nuevoEstado: Incidencia['estado']) => {
    setIncidencias(prev => prev.map(inc =>
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc
    ));
  };

  return (
    <ExpedientesContext.Provider value={{ expedientes, incidencias, agregarExpediente, actualizarEstado, agregarDocumento, actualizarIncidencia }}>
      {children}
    </ExpedientesContext.Provider>
  );
}

function useExpedientes() {
  const context = useContext(ExpedientesContext);
  if (!context) throw new Error('useExpedientes debe usarse dentro de ExpedientesProvider');
  return context;
}

// --- COMPONENTES UI ---

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) {
  const variants = {
    default: 'bg-slate-200 text-slate-700 border-slate-300',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>{children}</span>;
}

function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Dropdown({ trigger, children, open, setOpen }: { trigger: React.ReactNode; children: React.ReactNode; open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[140px]">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// --- VISTAS ---

function DashboardView() {
  const { expedientes } = useExpedientes();

  const stats = {
    total: expedientes.length,
    pendientes: expedientes.filter(e => e.estado === 'ValidacionLegalPendiente' || e.estado === 'DocumentacionPendiente').length,
    enAprobacion: expedientes.filter(e => e.estado === 'ListoParaAprobacion').length,
    aprobados: expedientes.filter(e => e.estado === 'Aprobado' || e.estado === 'RecepcionBienesServicios').length,
    pagados: expedientes.filter(e => e.estado === 'Pagado').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Vista general del sistema de control</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { title: 'Total Expedientes', value: stats.total, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-200' },
          { title: 'Pendientes', value: stats.pendientes, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { title: 'Por Aprobar', value: stats.enAprobacion, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Aprobados', value: stats.aprobados, icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Pagados', value: stats.pagados, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-slate-100 rounded-xl border border-slate-300 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{kpi.value}</p>
                </div>
                <div className={`${kpi.bg} p-3 rounded-xl`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Expedientes Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.slice(0, 5).map(exp => (
                <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                  <td className="py-3 px-4 capitalize">{exp.tipo}</td>
                  <td className="py-3 px-4">{exp.razonSocial}</td>
                  <td className="py-3 px-4 font-mono">Bs. {exp.monto.toLocaleString()}</td>
                  <td className="py-3 px-4"><Badge variant={exp.estado === 'Pagado' ? 'success' : exp.estado === 'Aprobado' ? 'info' : 'warning'}>{exp.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- VISTAS SOLICITANTE ---

function NuevoExpedienteView() {
  const { agregarExpediente } = useExpedientes();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState<null | boolean>(null);
  const [proveedorSancionado, setProveedorSancionado] = useState<null | { sancionado: boolean; razon?: string; empresa?: string }>(null);
  const [verificandoRif, setVerificandoRif] = useState(false);

  // Lista de proveedores sancionados (en producción vendría de una API/BD)
  const PROVEEDORES_SANCIONADOS = [
    { rif: 'G-11223344-5', razon: 'Inhabilitada por 3 años – Providencia Administrativa DG/2025/009 del SNC', empresa: 'Corporación Fantasma C.A.' },
    { rif: 'J-00000000-0', razon: 'Fraude documentario - Expediente N° 2024-1234', empresa: 'Empresa Ficticia S.A.' },
  ];

  const verificarRif = (rif: string) => {
    if (!rif || rif.length < 5) {
      setProveedorSancionado(null);
      return;
    }

    setVerificandoRif(true);
    // Simulamos una verificación con delay
    setTimeout(() => {
      const sancionado = PROVEEDORES_SANCIONADOS.find(p => p.rif.toUpperCase() === rif.toUpperCase());
      if (sancionado) {
        setProveedorSancionado({ sancionado: true, razon: sancionado.razon, empresa: sancionado.empresa });
      } else {
        setProveedorSancionado({ sancionado: false });
      }
      setVerificandoRif(false);
    }, 500);
  };

  const verificarDisponibilidad = () => {
    setLoading(true);
    setTimeout(() => {
      setDisponibilidad(Math.random() > 0.3);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar si el proveedor está sancionado
    if (proveedorSancionado?.sancionado) {
      return; // No permitir envío
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    setTimeout(() => {
      agregarExpediente({
        tipo: formData.get('tipo') as 'compra' | 'servicio',
        numeroOrden: `${formData.get('tipo') === 'compra' ? 'OC' : 'OS'}-${formData.get('numeroOrden')}`,
        fechaIngreso: formData.get('fechaIngreso') as string,
        unidadUsuaria: formData.get('unidadUsuaria') as string,
        puntoCuenta: formData.get('puntoCuenta') as string,
        objeto: formData.get('objeto') as string,
        rif: formData.get('rif') as string,
        razonSocial: formData.get('razonSocial') as string,
        partida: formData.get('partida') as string,
        monto: parseFloat(formData.get('monto') as string) || 0,
        modalidad: formData.get('modalidad') as string,
        creadoPor: user?.id || '',
        precioReferencia: (parseFloat(formData.get('monto') as string) || 0) * 0.9,
      });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      (e.target as HTMLFormElement).reset();
      setDisponibilidad(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Nuevo Expediente</h2>
        <p className="text-sm text-slate-500 mt-1">Crear una nueva solicitud de compra o servicio</p>
      </div>

      {submitted && (
        <div className="bg-emerald-100 border border-emerald-300 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          <div>
            <h3 className="font-bold text-emerald-900">Expediente Creado</h3>
            <p className="text-sm text-emerald-800 mt-1">El expediente ha sido enviado a validación legal.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="bg-slate-200/50 px-8 py-5 border-b border-slate-300">
          <h3 className="font-bold text-slate-800">Formulario de Registro</h3>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="bg-blue-200 w-6 h-6 rounded flex items-center justify-center border border-blue-300">1</span> Datos del Trámite
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo <span className="text-red-500">*</span></label>
                <select name="tipo" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Seleccione...</option>
                  <option value="compra">Orden de Compra</option>
                  <option value="servicio">Orden de Servicio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">N° Punto de Cuenta / N° Oficio de Requerimiento <span className="text-red-500">*</span></label>
                <input name="puntoCuenta" required type="text" placeholder="DM-045-2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Partida <span className="text-red-500">*</span></label>
                <input name="partida" required type="text" placeholder="4.02.00.00.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Número de Orden</label>
                <input name="numeroOrden" type="text" placeholder="2026-0001" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha</label>
                <input name="fechaIngreso" type="date" defaultValue="2026-05-20" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unidad Usuaria</label>
                <select name="unidadUsuaria" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Despacho del Ministro">Despacho del Ministro</option>
                  <option value="Dirección General de Tecnología">Dirección General de Tecnología</option>
                  <option value="Dirección de Administración">Dirección de Administración</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Objeto de la Contratación <span className="text-red-500">*</span></label>
                <textarea name="objeto" required rows={2} placeholder="Descripción de los bienes o servicios..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-300" />

          <section>
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="bg-emerald-200 w-6 h-6 rounded flex items-center justify-center border border-emerald-300">2</span> Disponibilidad Presupuestaria
            </h4>
            <div className="flex items-center gap-4">
              <button type="button" onClick={verificarDisponibilidad} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Verificando...' : 'Verificar Disponibilidad'}
              </button>
              {disponibilidad !== null && (
                <Badge variant={disponibilidad ? 'success' : 'error'}>
                  {disponibilidad ? 'Disponibilidad Confirmada' : 'Sin Disponibilidad'}
                </Badge>
              )}
            </div>
          </section>

          <hr className="border-slate-300" />

          <section>
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="bg-amber-200 w-6 h-6 rounded flex items-center justify-center border border-amber-300">3</span> Datos del Proveedor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">RIF <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input
                    name="rif"
                    required
                    type="text"
                    placeholder="J-12345678-9"
                    onChange={(e) => verificarRif(e.target.value)}
                    className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none ${proveedorSancionado?.sancionado ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                  />
                  {verificandoRif && (
                    <div className="flex items-center px-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {proveedorSancionado?.sancionado && (
                  <div className="mt-3 bg-red-100 border border-red-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800">PROVEEDOR SANCIONADO</h4>
                        <p className="text-sm text-red-700 mt-1">
                          <strong>{proveedorSancionado.empresa}</strong>
                        </p>
                        <p className="text-sm text-red-600 mt-1">{proveedorSancionado.razon}</p>
                        <p className="text-xs text-red-500 mt-2 font-semibold">
                          No es posible continuar con este proveedor. Consulte el Registro Nacional de Contratistas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {proveedorSancionado && !proveedorSancionado.sancionado && (
                  <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Proveedor verificado - Sin sanciones registradas
                  </p>
                )}
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razón Social <span className="text-red-500">*</span></label>
                <input name="razonSocial" required type="text" placeholder="Nombre de la empresa" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto (Bs.) <span className="text-red-500">*</span></label>
                <input name="monto" required type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Modalidad</label>
                <select name="modalidad" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Consulta de Precio">Consulta de Precio</option>
                  <option value="Concurso Abierto">Concurso Abierto</option><option value="Concurso Cerrado">Concurso Cerrado</option>
                  <option value="Adjudicación Directa">Adjudicación Directa</option>

                </select>
              </div>
            </div>
          </section>




        </div>

        <div className="bg-slate-200/50 px-8 py-5 border-t border-slate-300 flex justify-end gap-4">
          <button type="reset" onClick={() => setProveedorSancionado(null)} className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm">
            Limpiar
          </button>
          <button
            disabled={loading || proveedorSancionado?.sancionado}
            type="submit"
            className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 ${proveedorSancionado?.sancionado ? 'bg-red-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {proveedorSancionado?.sancionado ? 'Proveedor Sancionado' : loading ? 'Procesando...' : 'Crear Expediente'}
          </button>
        </div>
      </form>
    </div>
  );
}

function MisSolicitudesView() {
  const { expedientes } = useExpedientes();
  const { user } = useAuth();

  const misExpedientes = expedientes.filter(e => e.creadoPor === user?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Mis Solicitudes</h2>
        <p className="text-sm text-slate-500">Expedientes creados por ti</p>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Objeto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {misExpedientes.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No tienes expedientes creados</td></tr>
              ) : (
                misExpedientes.map(exp => (
                  <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                    <td className="py-3 px-4 capitalize">{exp.tipo}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{exp.objeto}</td>
                    <td className="py-3 px-4 font-mono">Bs. {exp.monto.toLocaleString()}</td>
                    <td className="py-3 px-4"><Badge variant={exp.estado === 'Pagado' ? 'success' : 'warning'}>{exp.estado}</Badge></td>
                    <td className="py-3 px-4 text-slate-500">{exp.fechaIngreso}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- VISTAS ANALISTA ---

function BandejaValidacionView() {
  const { expedientes, actualizarEstado } = useExpedientes();
  const pendientes = expedientes.filter(e => e.estado === 'ValidacionLegalPendiente');

  const handleValidar = (id: string) => {
    actualizarEstado(id, 'DocumentacionPendiente', 'Validación legal completada');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Bandeja de Validación</h2>
        <p className="text-sm text-slate-500">Expedientes pendientes de validación legal</p>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No hay expedientes pendientes de validación</td></tr>
              ) : (
                pendientes.map(exp => (
                  <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                    <td className="py-3 px-4 capitalize">{exp.tipo}</td>
                    <td className="py-3 px-4">{exp.razonSocial}</td>
                    <td className="py-3 px-4 font-mono">Bs. {exp.monto.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleValidar(exp.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">
                        Validar y Enviar a Documentación
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VerificarDocumentacionView() {
  const { expedientes, actualizarEstado, agregarDocumento } = useExpedientes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [nuevoDoc, setNuevoDoc] = useState('');

  const pendientes = expedientes.filter(e => e.estado === 'DocumentacionPendiente');

  const verificarDocumentos = (exp: Expediente) => {
    return documentosRequeridos.map(doc => ({
      nombre: doc,
      presente: exp.documentos.some(d => d.toLowerCase().includes(doc.toLowerCase().replace('.pdf', '')))
    }));
  };

  const todosPresentes = (exp: Expediente) => {
    const checks = verificarDocumentos(exp);
    return checks.every(c => c.presente);
  };

  const handleAgregarDoc = () => {
    if (selectedExp && nuevoDoc) {
      agregarDocumento(selectedExp, nuevoDoc);
      setNuevoDoc('');
      setDialogOpen(false);
    }
  };

  const handleConfirmar = (id: string) => {
    actualizarEstado(id, 'ListoParaAprobacion', 'Documentación verificada completa');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Verificar Documentación</h2>
        <p className="text-sm text-slate-500">Revisar y completar documentos de expedientes</p>
      </div>

      {pendientes.length === 0 ? (
        <div className="bg-slate-100 rounded-xl border border-slate-300 p-8 text-center text-slate-500">
          No hay expedientes pendientes de verificación de documentación
        </div>
      ) : (
        <div className="space-y-4">
          {pendientes.map(exp => {
            const checks = verificarDocumentos(exp);
            return (
              <div key={exp.id} className="bg-slate-100 rounded-xl border border-slate-300 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{exp.id}</h3>
                    <p className="text-sm text-slate-500">{exp.razonSocial} - Bs. {exp.monto.toLocaleString()}</p>
                  </div>
                  <Badge variant="warning">Documentación Pendiente</Badge>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Documentos Requeridos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {checks.map(check => (
                      <div key={check.nombre} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <input type="checkbox" checked={check.presente} readOnly className="w-4 h-4 rounded border-slate-300" />
                        <span className={`text-sm ${check.presente ? 'text-slate-700' : 'text-slate-400'}`}>{check.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { setSelectedExp(exp.id); setDialogOpen(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Agregar Documento
                  </button>
                  <button onClick={() => handleConfirmar(exp.id)} disabled={!todosPresentes(exp)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirmar y Enviar a Aprobación
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Agregar Documento">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del documento</label>
            <input type="text" value={nuevoDoc} onChange={e => setNuevoDoc(e.target.value)} placeholder="nota_entrega.pdf" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">Cancelar</button>
            <button onClick={handleAgregarDoc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Agregar</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function IncidenciasView() {
  const { incidencias, actualizarIncidencia } = useExpedientes();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const estadoVariant = (estado: Incidencia['estado']) => {
    switch (estado) {
      case 'abierta': return 'error';
      case 'en_proceso': return 'warning';
      case 'cerrada': return 'success';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Incidencias</h2>
        <p className="text-sm text-slate-500">Gestión de incidencias en expedientes</p>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Expediente</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map(inc => (
                <tr key={inc.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs">{inc.id}</td>
                  <td className="py-3 px-4 font-mono text-xs">{inc.expedienteId}</td>
                  <td className="py-3 px-4 max-w-xs">{inc.descripcion}</td>
                  <td className="py-3 px-4"><Badge variant={estadoVariant(inc.estado)}>{inc.estado}</Badge></td>
                  <td className="py-3 px-4">
                    <Dropdown
                      open={openDropdown === inc.id}
                      setOpen={(v) => setOpenDropdown(v ? inc.id : null)}
                      trigger={
                        <button className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                          Cambiar Estado <ChevronDown className="w-3 h-3" />
                        </button>
                      }
                    >
                      <button onClick={() => { actualizarIncidencia(inc.id, 'abierta'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm">Abierta</button>
                      <button onClick={() => { actualizarIncidencia(inc.id, 'en_proceso'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm">En Proceso</button>
                      <button onClick={() => { actualizarIncidencia(inc.id, 'cerrada'); setOpenDropdown(null); }} className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm">Cerrada</button>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- VISTAS APROBADOR ---

function BandejaAprobacionView() {
  const { expedientes, actualizarEstado } = useExpedientes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docsDialogOpen, setDocsDialogOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Expediente | null>(null);
  const [comentarioRechazo, setComentarioRechazo] = useState('');

  const listos = expedientes.filter(e => e.estado === 'ListoParaAprobacion');

  const handleAprobar = (id: string) => {
    actualizarEstado(id, 'Aprobado', 'Expediente aprobado por gerencia');
  };

  const handleRechazar = () => {
    if (selectedExp) {
      actualizarEstado(selectedExp.id, 'Registrado', comentarioRechazo || 'Rechazado por gerencia');
      setDialogOpen(false);
      setComentarioRechazo('');
      setSelectedExp(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Bandeja de Aprobación</h2>
        <p className="text-sm text-slate-500">Expedientes listos para aprobación gerencial</p>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listos.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No hay expedientes pendientes de aprobación</td></tr>
              ) : (
                listos.map(exp => (
                  <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                    <td className="py-3 px-4 capitalize">{exp.tipo}</td>
                    <td className="py-3 px-4">{exp.razonSocial}</td>
                    <td className="py-3 px-4 font-mono">Bs. {exp.monto.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedExp(exp); setDocsDialogOpen(true); }} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Ver Documentos
                        </button>
                        <button onClick={() => handleAprobar(exp.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">
                          Aprobar
                        </button>
                        <button onClick={() => { setSelectedExp(exp); setDialogOpen(true); }} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={docsDialogOpen} onClose={() => setDocsDialogOpen(false)} title="Documentos del Expediente">
        <div className="space-y-2">
          {selectedExp?.documentos.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay documentos adjuntos</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedExp?.documentos.map((doc, i) => (
                <Badge key={i} variant="info">{doc}</Badge>
              ))}
            </div>
          )}
        </div>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Rechazar Expediente">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Comentario (opcional)</label>
            <textarea value={comentarioRechazo} onChange={e => setComentarioRechazo(e.target.value)} rows={3} placeholder="Motivo del rechazo..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm resize-none" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">Cancelar</button>
            <button onClick={handleRechazar} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Rechazar</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function AlertasView() {
  const [alerts, setAlerts] = useState(alertasMock);

  const alertConfig = {
    critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
    warning: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Centro de Alertas</h2>
        <p className="text-sm text-slate-500">Notificaciones del sistema</p>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => {
          const config = alertConfig[alert.type as keyof typeof alertConfig];
          const Icon = config.icon;
          return (
            <div key={alert.id} className={`bg-slate-100 border rounded-xl p-5 flex items-start gap-4 shadow-sm ${config.border}`}>
              <div className={`${config.bg} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{alert.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <Badge>{alert.expediente}</Badge>
                  <span className="text-slate-500">{alert.date}</span>
                </div>
              </div>
              <button onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- VISTAS AUDITOR ---

function ReportesAuditoriaView() {
  const { expedientes } = useExpedientes();

  const docsIncompletos = expedientes.filter(exp => {
    const faltantes = documentosRequeridos.filter(doc =>
      !exp.documentos.some(d => d.toLowerCase().includes(doc.toLowerCase().replace('.pdf', '')))
    );
    return faltantes.length > 0 && exp.estado !== 'ValidacionLegalPendiente';
  });

  const desviacionPrecio = expedientes.filter(exp => {
    const desviacion = ((exp.monto - exp.precioReferencia) / exp.precioReferencia) * 100;
    return desviacion > 20;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Reportes de Auditoría</h2>
        <p className="text-sm text-slate-500">Análisis de expedientes para control interno</p>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 p-6 mb-4">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-600" /> Documentación Incompleta ({docsIncompletos.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Documentos Faltantes</th>
              </tr>
            </thead>
            <tbody>
              {docsIncompletos.length === 0 ? (
                <tr><td colSpan={3} className="py-8 text-center text-slate-500">Todos los expedientes tienen documentación completa</td></tr>
              ) : (
                docsIncompletos.map(exp => {
                  const faltantes = documentosRequeridos.filter(doc =>
                    !exp.documentos.some(d => d.toLowerCase().includes(doc.toLowerCase().replace('.pdf', '')))
                  );
                  return (
                    <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                      <td className="py-3 px-4"><Badge variant="warning">{exp.estado}</Badge></td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {faltantes.map(f => <Badge key={f} variant="error">{f}</Badge>)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-300 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" /> Desviaciones de Precio ({'>'}20%) ({desviacionPrecio.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Monto</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Precio Ref.</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Desviación</th>
              </tr>
            </thead>
            <tbody>
              {desviacionPrecio.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No hay desviaciones de precio significativas</td></tr>
              ) : (
                desviacionPrecio.map(exp => {
                  const desviacion = ((exp.monto - exp.precioReferencia) / exp.precioReferencia) * 100;
                  return (
                    <tr key={exp.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-xs">{exp.id}</td>
                      <td className="py-3 px-4 font-mono">Bs. {exp.monto.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono">Bs. {exp.precioReferencia.toLocaleString()}</td>
                      <td className="py-3 px-4"><Badge variant="error">+{desviacion.toFixed(1)}%</Badge></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MuestreoAleatorioView() {
  const { expedientes } = useExpedientes();
  const [muestreo, setMuestreo] = useState<Expediente[]>([]);

  const realizarMuestreo = () => {
    const shuffled = [...expedientes].sort(() => 0.5 - Math.random());
    setMuestreo(shuffled.slice(0, 3));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Muestreo Aleatorio</h2>
        <p className="text-sm text-slate-500">Selección aleatoria de expedientes para auditoría</p>
      </div>

      <div className="flex justify-center mb-6">
        <button onClick={realizarMuestreo} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
          <Shuffle className="w-5 h-5" /> Realizar Muestreo (3 expedientes)
        </button>
      </div>

      {muestreo.length > 0 && (
        <div className="space-y-4">
          {muestreo.map((exp, i) => (
            <div key={exp.id} className="bg-amber-50 rounded-xl border-2 border-amber-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">Muestra #{i + 1}</span>
                  <h3 className="font-bold text-slate-800 text-lg">{exp.id}</h3>
                </div>
                <Badge variant="warning">{exp.estado}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-slate-500">Proveedor:</span><br /><span className="font-semibold">{exp.razonSocial}</span></div>
                <div><span className="text-slate-500">Monto:</span><br /><span className="font-mono font-semibold">Bs. {exp.monto.toLocaleString()}</span></div>
                <div><span className="text-slate-500">Tipo:</span><br /><span className="font-semibold capitalize">{exp.tipo}</span></div>
                <div><span className="text-slate-500">Documentos:</span><br /><span className="font-semibold">{exp.documentos.length} archivos</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SIDEBAR Y HEADER ---

function Sidebar({ activeTab, setActiveTab, isOpen, user, logout }: { activeTab: string; setActiveTab: (tab: string) => void; isOpen: boolean; user: any; logout: () => void }) {
  const getMenuItems = () => {
    const menus: Record<UserRole, { id: string; icon: any; label: string; description: string }[]> = {
      solicitante: [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'Panel de control' },
        { id: 'nuevoExpediente', icon: FileText, label: 'Nuevo Expediente', description: 'Crear solicitud' },
        { id: 'misSolicitudes', icon: ClipboardList, label: 'Mis Solicitudes', description: 'Ver mis expedientes' },
      ],
      analista: [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'Panel de control' },
        { id: 'bandejaValidacion', icon: FileCheck, label: 'Bandeja Validación', description: 'Validar expedientes' },
        { id: 'verificarDocumentacion', icon: FileText, label: 'Verificar Documentación', description: 'Revisar documentos' },
        { id: 'incidencias', icon: AlertCircle, label: 'Incidencias', description: 'Gestionar incidencias' },
      ],
      aprobador: [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'Panel de control' },
        { id: 'bandejaAprobacion', icon: Check, label: 'Bandeja Aprobación', description: 'Aprobar expedientes' },
        { id: 'alertas', icon: Bell, label: 'Alertas', description: 'Centro de alertas' },
      ],
      auditor: [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'Panel de control' },
        { id: 'reportesAuditoria', icon: ClipboardList, label: 'Reportes de Auditoría', description: 'Análisis de control' },
        { id: 'muestreoAleatorio', icon: Shuffle, label: 'Muestreo Aleatorio', description: 'Selección aleatoria' },
        { id: 'incidencias', icon: AlertCircle, label: 'Incidencias', description: 'Gestionar incidencias' },
      ],
    };
    return menus[user?.role as UserRole] || menus.solicitante;
  };

  const menuItems = getMenuItems();

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      solicitante: 'Solicitante',
      analista: 'Analista',
      aprobador: 'Aprobador',
      auditor: 'Auditor',
    };
    return roles[role] || role;
  };

  return (
    <aside className={`w-64 bg-slate-900 border-r border-slate-800 h-[calc(100vh-5rem)] fixed left-0 top-20 overflow-y-auto z-30 transition-transform duration-300 hidden md:block ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{item.label}</p>
                <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 bg-slate-900">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuario')}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-lg" alt="User" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-slate-400">{getRoleName(user?.role || '')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

function HeaderWithLogout({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-40 h-20 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={toggleSidebar} className="text-white hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-colors hidden md:block">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">MPPRIJP</h1>
              <p className="text-xs text-slate-400">Sistema de Control Interno</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="h-16 flex items-center justify-center py-1">
              <img src="/logo-justos.png" alt="Logo Justos" className="h-full w-auto object-contain drop-shadow-md hover:drop-shadow-xl transition-all" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- MAIN APP COMPONENT ---

function HomeContent({ user, logout }: { user: any; logout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'nuevoExpediente': return <NuevoExpedienteView />;
      case 'misSolicitudes': return <MisSolicitudesView />;
      case 'bandejaValidacion': return <BandejaValidacionView />;
      case 'verificarDocumentacion': return <VerificarDocumentacionView />;
      case 'incidencias': return <IncidenciasView />;
      case 'bandejaAprobacion': return <BandejaAprobacionView />;
      case 'alertas': return <AlertasView />;
      case 'reportesAuditoria': return <ReportesAuditoriaView />;
      case 'muestreoAleatorio': return <MuestreoAleatorioView />;
      default: return <DashboardView />;
    }
  };

  const getMobileMenuItems = () => {
    const menus: Record<UserRole, { id: string; icon: any }[]> = {
      solicitante: [
        { id: 'dashboard', icon: BarChart3 },
        { id: 'nuevoExpediente', icon: FileText },
        { id: 'misSolicitudes', icon: ClipboardList },
      ],
      analista: [
        { id: 'dashboard', icon: BarChart3 },
        { id: 'bandejaValidacion', icon: FileCheck },
        { id: 'verificarDocumentacion', icon: FileText },
        { id: 'incidencias', icon: AlertCircle },
      ],
      aprobador: [
        { id: 'dashboard', icon: BarChart3 },
        { id: 'bandejaAprobacion', icon: Check },
        { id: 'alertas', icon: Bell },
      ],
      auditor: [
        { id: 'dashboard', icon: BarChart3 },
        { id: 'reportesAuditoria', icon: ClipboardList },
        { id: 'muestreoAleatorio', icon: Shuffle },
        { id: 'incidencias', icon: AlertCircle },
      ],
    };
    return menus[user?.role as UserRole] || menus.solicitante;
  };

  const mobileMenuItems = getMobileMenuItems();

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-800">
      <HeaderWithLogout toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} user={user} logout={logout} />

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-3 overflow-x-auto">
          {mobileMenuItems.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-3 rounded-xl flex-shrink-0 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
              <tab.icon className="w-6 h-6" />
            </button>
          ))}
        </div>

        <main className={`flex-1 p-4 sm:p-6 md:p-10 pb-24 md:pb-10 overflow-x-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, loading, logout, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <ExpedientesProvider>
      <HomeContent user={user} logout={logout} />
    </ExpedientesProvider>
  );
}
