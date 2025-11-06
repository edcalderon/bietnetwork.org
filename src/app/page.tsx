export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-biet-primary to-biet-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4">Red Biet</h1>
          <p className="text-2xl mb-2">BietNetwork</p>
          <p className="text-xl text-biet-accent">
            Red descentralizada de unidades vivas que generan valor social, económico y ecológico
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">🏛️ DAO Governance</h3>
            <p>Gobernanza descentralizada mediante BGT token</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">💎 BGT Token</h3>
            <p>Biet Coin Genética - Token de utilidad y gobernanza</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">🌱 Biets</h3>
            <p>Unidades productivas generando impacto social</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
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