'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Clock, Bell, FileText, BarChart3, AlertCircle, 
  CheckCircle2, Info, Trash2, Search, TrendingUp, Users, Check, X, Menu, Calendar, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import LoginView from '@/components/login-view';
import ExpedienteDetalleView from '@/components/expediente-detalle-view';

// --- DATA MOCKS ---

const dashboardData = [
  { month: 'Ene', expedientes: 65, completados: 55 },
  { month: 'Feb', expedientes: 75, completados: 68 },
  { month: 'Mar', expedientes: 68, completados: 60 },
  { month: 'Abr', expedientes: 85, completados: 75 },
  { month: 'May', expedientes: 78, completados: 70 },
  { month: 'Jun', expedientes: 90, completados: 85 },
];

const statusData = [
  { name: 'Completados', value: 295, color: '#10b981', percentage: '55%' },
  { name: 'En Proceso', value: 168, color: '#3b82f6', percentage: '30%' },
  { name: 'Pendientes', value: 87, color: '#f59e0b', percentage: '15%' },
];

const initialAlerts = [
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
    expediente: 'Varios',
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
    type: 'info',
    title: 'Actualización del Sistema',
    description: 'Nueva versión de módulo de Auditoría instalada exitosamente',
    expediente: 'Sistema',
    date: 'Ayer 10:00',
    actionRequired: false,
  },
];

const timelineEvents = [
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
    expediente: 'EXP-2026-0037',
    status: 'rejected',
    title: 'Requiere Correcciones',
    description: 'Se encontraron inconsistencias. Se requiere re-evaluación',
    date: '15 May 2026',
    time: '10:30',
    user: 'Revisor Control - Luis Rivas',
  },
];

// --- COMPONENTS ---

function Sidebar({ activeTab, setActiveTab, isOpen, user, logout }) {
  // Definir menús según el rol
  const getMenuItems = () => {
    const baseMenus = {
      dashboard: { id: 'dashboard', icon: BarChart3, label: 'Dashboard', description: 'Panel de control' },
      expedientes: { id: 'expedientes', icon: FileText, label: 'Nuevo Expediente', description: 'Crear solicitud' },
      misSolicitudes: { id: 'misSolicitudes', icon: Clock, label: 'Mis Solicitudes', description: 'Ver mis expedientes' },
      bandejaValidacion: { id: 'bandejaValidacion', icon: FileText, label: 'Bandeja Validación', description: 'Validar expedientes' },
      incidencias: { id: 'incidencias', icon: AlertCircle, label: 'Incidencias', description: 'Gestionar incidencias' },
      bandejaAprobacion: { id: 'bandejaAprobacion', icon: Check, label: 'Bandeja Aprobación', description: 'Aprobar expedientes' },
      alerts: { id: 'alerts', icon: Bell, label: 'Alertas', description: 'Centro de alertas' },
      timeline: { id: 'timeline', icon: Clock, label: 'Timeline', description: 'Trazabilidad' },
      documentos: { id: 'documentos', icon: Calendar, label: 'Documentos', description: 'Documentos y vigencias' },
    };

    switch (user?.role) {
      case 'admin':
        return [baseMenus.dashboard, baseMenus.expedientes, baseMenus.misSolicitudes, baseMenus.timeline, baseMenus.alerts];
      case 'user':
        return [baseMenus.dashboard, baseMenus.bandejaValidacion, baseMenus.incidencias, baseMenus.timeline];
      case 'gerente':
        return [baseMenus.dashboard, baseMenus.bandejaAprobacion, baseMenus.alerts, baseMenus.documentos];
      default:
        return [baseMenus.dashboard, baseMenus.expedientes, baseMenus.timeline, baseMenus.alerts];
    }
  };

  const menuItems = getMenuItems();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'user': return 'Analista';
      case 'gerente': return 'Gerente';
      default: return role;
    }
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
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive
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
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuario')}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-lg" alt="User"/>
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

function DashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Gerencial</h2>
        <p className="text-sm text-slate-500">Vista general de control y gestión de expedientes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: 'Trazabilidad', value: '100%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-200/60' },
          { title: 'Expedientes Activos', value: '550', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-200/60' },
          { title: 'Alertas Críticas', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-200/60' },
          { title: 'Usuarios Activos', value: '24', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-200/60' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-slate-100 rounded-xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{kpi.value}</p>
                </div>
                <div className={`${kpi.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-slate-100 rounded-xl border border-slate-300 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Evolución de Expedientes
            </h3>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Registrados</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Completados</span>
            </div>
          </div>
          
          <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2 pt-4">
            {dashboardData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div className="flex items-end gap-1.5 w-full justify-center h-48 mb-3">
                  <div className="w-1/3 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative" style={{ height: `${d.expedientes}%` }}></div>
                  <div className="w-1/3 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-colors relative" style={{ height: `${d.completados}%` }}></div>
                </div>
                <span className="text-sm font-semibold text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-100 rounded-xl border border-slate-300 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Estado Actual</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full shadow-inner mb-6" style={{ background: 'conic-gradient(#10b981 0% 55%, #3b82f6 55% 85%, #f59e0b 85% 100%)' }}>
              <div className="absolute inset-0 m-auto w-28 h-28 md:w-32 md:h-32 bg-slate-100 rounded-full flex items-center justify-center flex-col shadow-sm">
                <span className="text-3xl font-black text-slate-800">550</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total</span>
              </div>
            </div>
            
            <div className="w-full space-y-3">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-slate-200/50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{item.value}</span>
                    <span className="text-xs text-slate-500 w-8 text-right">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsView() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const alertConfig = {
    critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300', badge: 'bg-red-200 text-red-800' },
    warning: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300', badge: 'bg-amber-200 text-amber-800' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300', badge: 'bg-blue-200 text-blue-800' },
  };

  const filteredAlerts = alerts
    .filter(a => filter === 'all' || a.type === filter)
    .filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.expediente.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Centro de Alertas</h2>
        <p className="text-sm text-slate-500">Notificaciones automáticas y preventivas del sistema</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por expediente, título o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'critical', 'warning', 'info'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === type ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            {type === 'all' && 'Todas las Alertas'}
            {type === 'critical' && 'Críticas'}
            {type === 'warning' && 'Advertencias'}
            {type === 'info' && 'Información'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 bg-slate-100 border border-slate-300 rounded-xl">
            <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No se encontraron alertas</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          return (
            <div key={alert.id} className={`bg-slate-100 border rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all ${config.border}`}>
              <div className={`${config.bg} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-1.5">
                  <h3 className="font-bold text-slate-800">{alert.title}</h3>
                  {alert.actionRequired && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.badge}`}>Acción Requerida</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-3">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-lg bg-slate-200/60 text-slate-700 border border-slate-300">{alert.expediente}</span>
                  <span className="text-slate-500"><Clock className="w-3 h-3 inline mr-1"/>{alert.date}</span>
                </div>
              </div>
              <button onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function TimelineView() {
  const [searchQuery, setSearchQuery] = useState('');

  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300', label: 'Completado' },
    'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300', label: 'En Progreso' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300', label: 'Pendiente' },
    rejected: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300', label: 'Observado' },
  };

  const filteredEvents = timelineEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.expediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Timeline de Trazabilidad</h2>
        <p className="text-sm text-slate-500 mt-1">Historial completo e inmutable de los procesos recientes</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar evento, expediente o usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
        />
      </div>

      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 bg-slate-100 border border-slate-300 rounded-xl">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No se encontraron eventos</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => {
          const config = statusConfig[event.status];
          const Icon = config.icon;
          
          return (
            <div key={event.id} className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`${config.bg} p-2.5 rounded-full z-10 shadow-sm border ${config.border}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                {index < filteredEvents.length - 1 && <div className="w-0.5 h-full bg-slate-300 mt-2"></div>}
              </div>

              <div className="flex-1 pb-6">
                <div className="bg-slate-100 rounded-xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-lg bg-slate-200/60 text-slate-700 text-xs font-bold border border-slate-300">
                          {event.expediente}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full ${config.bg} text-xs font-bold ${config.color} border ${config.border}`}>
                          {config.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                    </div>
                    <div className="text-right text-xs font-semibold text-slate-600 bg-slate-200/50 px-3 py-2 rounded-lg border border-slate-200">
                      <p>{event.date}</p>
                      <p className="mt-0.5">{event.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{event.description}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">{event.user}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function ExpedientesView() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Expedientes</h2>
        <p className="text-sm text-slate-500 mt-1">Apertura y registro de nuevas órdenes de compra o servicio</p>
      </div>

      {submitted && (
        <div className="bg-emerald-100/50 border border-emerald-300 p-5 rounded-xl flex items-start gap-4 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="bg-emerald-200/70 p-2 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">Registro Exitoso</h3>
            <p className="text-sm text-emerald-800 mt-1">El expediente ha sido ingresado al workflow. Número de control asignado: <span className="font-mono font-bold bg-emerald-200/70 px-1.5 py-0.5 rounded border border-emerald-300">EXP-2026-0842</span></p>
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
              <span className="bg-blue-200 w-6 h-6 rounded flex items-center justify-center border border-blue-300">1</span> Datos Identificativos del Trámite
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Trámite <span className="text-red-500">*</span></label>
                <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="">Seleccione...</option>
                  <option value="compra">Orden de Compra</option>
                  <option value="servicio">Orden de Servicio</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Número de Orden <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-slate-200 border border-slate-300 rounded-lg text-slate-500 font-mono text-sm flex items-center font-semibold">OS-</span>
                  <input required type="text" placeholder="2026-0001" className="flex-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha de Ingreso <span className="text-red-500">*</span></label>
                <input required type="date" defaultValue="2026-05-20" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unidad Usuaria <span className="text-red-500">*</span></label>
                <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="">Seleccione la dependencia...</option>
                  <option>Despacho del Ministro</option>
                  <option>Dirección General de Tecnología</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Punto de Cuenta <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="DM-045-2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Objeto de la Contratación <span className="text-red-500">*</span></label>
                <textarea required rows="2" placeholder="Descripción breve de los bienes o servicios..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-300" />

          <section>
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="bg-emerald-200 w-6 h-6 rounded flex items-center justify-center border border-emerald-300">2</span> Datos del Contratista
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">RIF <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select className="w-20 px-2 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option>J</option><option>V</option><option>E</option><option>G</option>
                  </select>
                  <input required type="text" placeholder="12345678-9" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razón Social <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Nombre legal de la empresa" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>

          <hr className="border-slate-300" />

          <section>
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="bg-amber-200 w-6 h-6 rounded flex items-center justify-center border border-amber-300">3</span> Datos Financieros y Presupuestarios
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Partida Presupuestaria <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="4.02.00.00.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto Base (Bs.) <span className="text-red-500">*</span></label>
                <input required type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Modalidad <span className="text-red-500">*</span></label>
                <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  <option value="">Seleccione...</option>
                  <option>Adjudicación Directa</option>
                  <option>Concurso Abierto</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-200/50 px-8 py-5 border-t border-slate-300 flex justify-end gap-4">
          <button type="reset" className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors">
            Limpiar
          </button>
          <button disabled={loading} type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 rounded-lg shadow-md transition-colors flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? 'Procesando...' : 'Registrar Expediente'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- MAIN APP COMPONENT ---

function HomeContent({ user, logout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Obtener los menús según el rol para la navegación móvil
  const getMobileMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', icon: BarChart3 },
          { id: 'expedientes', icon: FileText },
          { id: 'misSolicitudes', icon: Clock },
          { id: 'timeline', icon: Clock },
          { id: 'alerts', icon: Bell }
        ];
      case 'user':
        return [
          { id: 'dashboard', icon: BarChart3 },
          { id: 'bandejaValidacion', icon: FileText },
          { id: 'incidencias', icon: AlertCircle },
          { id: 'timeline', icon: Clock }
        ];
      case 'gerente':
        return [
          { id: 'dashboard', icon: BarChart3 },
          { id: 'bandejaAprobacion', icon: Check },
          { id: 'alerts', icon: Bell },
          { id: 'documentos', icon: Calendar }
        ];
      default:
        return [
          { id: 'dashboard', icon: BarChart3 },
          { id: 'expedientes', icon: FileText },
          { id: 'timeline', icon: Clock },
          { id: 'alerts', icon: Bell }
        ];
    }
  };

  const mobileMenuItems = getMobileMenuItems();

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-800">
      <HeaderWithLogout toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} user={user} logout={logout} />
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around p-3 overflow-x-auto">
          {mobileMenuItems.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-3 rounded-xl flex-shrink-0 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
              <tab.icon className="w-6 h-6" />
            </button>
          ))}
        </div>

        <main className={`flex-1 p-4 sm:p-6 md:p-10 pb-24 md:pb-10 overflow-x-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'timeline' && <TimelineView />}
            {activeTab === 'alerts' && <AlertsView />}
            {activeTab === 'expedientes' && <ExpedientesView />}
            {activeTab === 'misSolicitudes' && <TimelineView />}
            {activeTab === 'bandejaValidacion' && <AlertsView />}
            {activeTab === 'bandejaAprobacion' && <AlertsView />}
            {activeTab === 'incidencias' && <AlertsView />}
            {activeTab === 'documentos' && <ExpedienteDetalleView onBack={() => setActiveTab('expedientes')} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, loading, logout, user } = useAuth();

  // Si está cargando la sesión, mostrar loading
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

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Si está autenticado, mostrar el dashboard
  return <HomeContent user={user} logout={logout} />;
}

function HeaderWithLogout({ toggleSidebar }) {
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
