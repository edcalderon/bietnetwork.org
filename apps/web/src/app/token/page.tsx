import { FaCoins, FaExchangeAlt, FaChartPie } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            💎 BGT Token
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Biet Coin Genética - Token de utilidad y gobernanza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FaCoins className="text-white" />}
            title="Utilidad"
            description="Usa BGT para acceder a servicios premium, participar en staking y obtener recompensas."
            gradient="bg-yellow-500"
          />
          <FeatureCard
            icon={<FaExchangeAlt className="text-white" />}
            title="Intercambio"
            description="Negocia BGT en exchanges descentralizados y forma parte de la economía del ecosistema."
            gradient="bg-blue-500"
          />
          <FeatureCard
            icon={<FaChartPie className="text-white" />}
            title="Gobernanza"
            description="Participa en la toma de decisiones de la red con tu poder de voto proporcional."
            gradient="bg-purple-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detalles del Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Información Técnica</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Símbolo:</span>
                  <span className="font-medium text-gray-900 dark:text-white">BGT</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Red:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Ethereum (ERC-20)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Suministro Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">1,000,000,000 BGT</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Distribución</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">40% Ecosistema</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">25% Equipo</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">20% Venta Pública</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">15% Recompensas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
