import { FaLeaf, FaHandsHelping, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';

export default function BietsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            🌱 Biets
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Unidades productivas generando impacto social
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FaLeaf className="text-white" />}
            title="Sostenibilidad"
            description="Cada Biet está comprometido con prácticas sostenibles y regenerativas."
            gradient="bg-green-500"
          />
          <FeatureCard
            icon={<FaHandsHelping className="text-white" />}
            title="Impacto Social"
            description="Generamos oportunidades económicas en comunidades locales."
            gradient="bg-teal-500"
          />
          <FeatureCard
            icon={<FaChartLine className="text-white" />}
            title="Crecimiento"
            description="Escalable y replicable para maximizar el impacto positivo."
            gradient="bg-emerald-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">¿Qué es un Biet?</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Un Biet es una unidad productiva autónoma que genera valor social, económico y ecológico. 
              Cada Biet opera de manera independiente pero está interconectado con la red, creando un 
              ecosistema de impacto positivo.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Características principales:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>Autonomía operativa</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>Impacto medible</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>Gobernanza participativa</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>Sostenibilidad económica</span>
              </li>
            </ul>

            <div className="mt-8 bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-100 dark:border-green-900">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">¿Quieres unirte a la red Biet?</h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Conviértete en parte de nuestro ecosistema y comienza a generar impacto positivo en tu comunidad.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Solicitar más información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
