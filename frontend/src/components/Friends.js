import React, { useState, useEffect } from 'react';
import { friendsAPI } from '../services/api';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await friendsAPI.getFriends();
      setFriends(response.data);
    } catch (error) {
      setError('Failed to fetch friends');
    }
  };

  const addFriend = async (e) => {
    e.preventDefault();
    if (!newFriendUsername.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await friendsAPI.addFriend(newFriendUsername);
      setSuccess('Friend added successfully!');
      setNewFriendUsername('');
      fetchFriends();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add friend');
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    try {
      await friendsAPI.removeFriend(friendId);
      setSuccess('Friend removed successfully!');
      fetchFriends();
    } catch (error) {
      setError('Failed to remove friend');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Friends</h2>
      
      {/* Add Friend Form */}
      <form onSubmit={addFriend} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
            placeholder="Enter friend's username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Friend'}
          </button>
        </div>
      </form>

      {/* Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Friends List */}
      <div className="space-y-3">
        {friends.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No friends added yet</p>
        ) : (
          friends.map((friend) => (
            <div key={friend._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">{friend.username}</span>
                <span className="text-gray-500 text-sm ml-2">{friend.email}</span>
              </div>
              <button
                onClick={() => removeFriend(friend._id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
