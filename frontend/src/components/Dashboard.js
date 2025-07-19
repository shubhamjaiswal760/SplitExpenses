import React, { useState } from 'react';
import Friends from './Friends';
import Transactions from './Transactions';
import Balances from './Balances';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('balances');

  const tabs = [
    { id: 'balances', name: 'Balances', icon: '💰' },
    { id: 'transactions', name: 'Transactions', icon: '💸' },
    { id: 'friends', name: 'Friends', icon: '👥' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'balances':
        return <Balances />;
      case 'transactions':
        return <Transactions />;
      case 'friends':
        return <Friends />;
      default:
        return <Balances />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Component */}
      {renderActiveComponent()}
    </div>
  );
};

export default Dashboard;
