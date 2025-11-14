import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
    <div className={`w-14 h-14 ${gradient} rounded-xl flex items-center justify-center mb-4`}>
      <div className="text-2xl">{icon}</div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default FeatureCard;
