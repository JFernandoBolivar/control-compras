import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Center: Title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-white">
              Sistema de Control Interno
            </h1>
            <p className="text-xs text-slate-300 mt-1">Ministerio del Poder Popular para Relaciones Interiores, Justicia y Paz</p>
          </div>

          {/* Right: Logo Justos */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 relative">
              <Image
                src="/logo-justos.png"
                alt="Justos por la Paz"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
