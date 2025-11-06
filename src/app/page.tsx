import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Red Biet
          </h1>
          <p className="text-2xl md:text-3xl font-light text-gray-300 mb-8">
            BietNetwork
          </p>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Red descentralizada de unidades vivas que generan valor social, económico y ecológico
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Link href="/governance" className="group">
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-green-400/30">
              <div className="text-4xl mb-4 group-hover:text-green-400 transition-colors">🏛️</div>
              <h3 className="text-2xl font-bold mb-3">DAO Governance</h3>
              <p className="text-gray-300">Gobernanza descentralizada mediante BGT token</p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Explorar <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
          
          <Link href="/token" className="group">
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-green-400/30">
              <div className="text-4xl mb-4 group-hover:text-green-400 transition-colors">💎</div>
              <h3 className="text-2xl font-bold mb-3">BGT Token</h3>
              <p className="text-gray-300">Biet Coin Genética - Token de utilidad y gobernanza</p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Conocer más <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
          
          <Link href="/biets" className="group">
            <div className="h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-green-400/30">
              <div className="text-4xl mb-4 group-hover:text-green-400 transition-colors">🌱</div>
              <h3 className="text-2xl font-bold mb-3">Biets</h3>
              <p className="text-gray-300">Unidades productivas generando impacto social</p>
              <div className="mt-4 text-green-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                Descubrir <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-6">Impacto ODS</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold">ODS 1</h4>
                <p className="text-sm">Reducción de pobreza</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💼</span>
              <div>
                <h4 className="font-bold">ODS 8</h4>
                <p className="text-sm">Empleo digno</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <h4 className="font-bold">ODS 10</h4>
                <p className="text-sm">Equidad en acceso</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏛️</span>
              <div>
                <h4 className="font-bold">ODS 16</h4>
                <p className="text-sm">Transparencia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-biet-accent">
            Team BlockchainFamily – MinTIC Bootcamp 2025
          </p>
          <p className="text-sm mt-2">contacto@bietnetwork.org</p>
        </div>
      </div>
    </div>
  )
}