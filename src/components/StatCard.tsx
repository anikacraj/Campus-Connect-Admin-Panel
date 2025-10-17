import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm mb-1">{title}</p>
          <p className="text-4xl font-extrabold">{value}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
