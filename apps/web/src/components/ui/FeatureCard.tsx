import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 ring-2 ring-gray-200/30 dark:ring-gray-600/30 hover:ring-gray-300/50 dark:hover:ring-gray-600/50">
    <div className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="text-2xl">{icon}</div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-200">{description}</p>
  </div>
);

export default FeatureCard;
