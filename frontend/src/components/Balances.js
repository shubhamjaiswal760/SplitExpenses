import React, { useState, useEffect } from 'react';
import { balancesAPI } from '../services/api';

const Balances = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await balancesAPI.getBalances();
      setBalances(response.data);
    } catch (error) {
      setError('Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  };

  const getBalanceText = (balance, friendName) => {
    if (balance > 0) {
      return `${friendName} owes you ₹${balance}`;
    } else if (balance < 0) {
      return `You owe ₹${Math.abs(balance)} to ${friendName}`;
    } else {
      return `All settled with ${friendName}`;
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Live Balances</h2>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      {balances.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No balances to show. Add some transactions with friends!
        </p>
      ) : (
        <div className="space-y-4">
          {balances.map((balanceItem) => (
            <div key={balanceItem.friend.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">
                    {balanceItem.friend.username}
                  </h3>
                  <p className={`text-sm font-semibold ${getBalanceColor(balanceItem.balance)}`}>
                    {getBalanceText(balanceItem.balance, balanceItem.friend.username)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getBalanceColor(balanceItem.balance)}`}>
                    {balanceItem.balance > 0 ? '+' : ''}₹{balanceItem.balance}
                  </div>
                </div>
              </div>
              
              {/* Detailed breakdown */}
              <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>You paid for them: ₹{balanceItem.userPaid}</span>
                  <span>They paid for you: ₹{balanceItem.friendPaid}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-2">Summary</h3>
            <div className="text-sm text-indigo-700">
              <p>
                Total you're owed: ₹
                {balances.reduce((sum, b) => sum + (b.balance > 0 ? b.balance : 0), 0)}
              </p>
              <p>
                Total you owe: ₹
                {balances.reduce((sum, b) => sum + (b.balance < 0 ? Math.abs(b.balance) : 0), 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balances;
