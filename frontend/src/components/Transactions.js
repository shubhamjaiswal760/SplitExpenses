import React, { useState, useEffect } from 'react';
import { transactionsAPI, friendsAPI } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [formData, setFormData] = useState({
    receiverUsername: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchFriends();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await friendsAPI.getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await transactionsAPI.createTransaction({
        receiverUsername: formData.receiverUsername,
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      
      setSuccess('Transaction added successfully!');
      setFormData({ receiverUsername: '', amount: '', description: '' });
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💸 Record Transaction</h2>
      
      {/* Add Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Friend's Username
          </label>
          <select
            name="receiverUsername"
            value={formData.receiverUsername}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a friend</option>
            {friends.map((friend) => (
              <option key={friend._id} value={friend.username}>
                {friend.username}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="100"
            min="0.01"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Lunch, Movie tickets, etc."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>

      {/* Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🧾 Transaction History</h3>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.payer.username} paid ₹{transaction.amount} for {transaction.receiver.username}
                    </p>
                    <p className="text-gray-600 text-sm">{transaction.description}</p>
                    <p className="text-gray-500 text-xs">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-indigo-600">
                      ₹{transaction.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
