import { FaVoteYea, FaUsers, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            🏛️ DAO Governance
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            Gobernanza descentralizada mediante BGT token
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaVoteYea className="text-white" />}
            title="Votación"
            description="Participa en la toma de decisiones importantes de la red mediante votación con tokens BGT."
            gradient="bg-blue-500"
          />
          <FeatureCard
            icon={<FaUsers className="text-white" />}
            title="Comunidad"
            description="Únete a una comunidad global comprometida con la gobernanza descentralizada."
            gradient="bg-green-500"
          />
          <FeatureCard
            icon={<FaChartLine className="text-white" />}
            title="Transparencia"
            description="Todas las decisiones y transacciones son públicas y verificables en la blockchain."
            gradient="bg-purple-500"
          />
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">¿Cómo funciona la gobernanza?</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              La gobernanza de Biet Network se basa en un sistema DAO (Organización Autónoma Descentralizada) donde los poseedores de tokens BGT pueden:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Proponer mejoras al ecosistema</li>
              <li>Votar sobre propuestas importantes</li>
              <li>Participar en la toma de decisiones estratégicas</li>
              <li>Gobernar los fondos del tesoro comunitario</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
