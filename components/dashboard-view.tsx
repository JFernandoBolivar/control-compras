'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react'

const dashboardData = [
  { month: 'Enero', expedientes: 45, completados: 38 },
  { month: 'Febrero', expedientes: 52, completados: 48 },
  { month: 'Marzo', expedientes: 48, completados: 42 },
  { month: 'Abril', expedientes: 61, completados: 56 },
  { month: 'Mayo', expedientes: 55, completados: 50 },
  { month: 'Junio', expedientes: 67, completados: 63 },
]

const statusData = [
  { name: 'Completados', value: 295, color: '#10b981' },
  { name: 'En Proceso', value: 168, color: '#3b82f6' },
  { name: 'Pendientes', value: 87, color: '#f59e0b' },
]

const kpiData = [
  { title: 'Trazabilidad', value: '100%', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300' },
  { title: 'Expedientes Activos', value: '550', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { title: 'Alertas Críticas', value: '12', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-300' },
  { title: 'Usuarios Activos', value: '24', icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-300' },
]

export default function DashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.title} className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border ${kpi.borderColor} p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-3">{kpi.value}</p>
                </div>
                <div className={`${kpi.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-7 h-7 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600 font-medium">Actualizado hoy</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Expedientes */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-7 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolución de Expedientes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '0.875rem' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="expedientes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completados" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Status */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-7 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Estado de Expedientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-300 p-7 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Tendencia de Velocidad de Procesamiento (horas)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dashboardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '0.875rem' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '0.875rem' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completados" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
