const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Add friend by username
router.post('/add', auth, async (req, res) => {
  try {
    const { username } = req.body;
    const currentUserId = req.user.userId;

    // Find friend by username
    const friend = await User.findOne({ username });
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to add themselves
    if (friend._id.toString() === currentUserId) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    // Check if already friends
    const currentUser = await User.findById(currentUserId);
    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Add friend to both users
    await User.findByIdAndUpdate(currentUserId, {
      $push: { friends: friend._id }
    });
    
    await User.findByIdAndUpdate(friend._id, {
      $push: { friends: currentUserId }
    });

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends list
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('friends', 'username email');
    
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.delete('/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user.userId;

    // Remove friend from both users
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId }
    });
    
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
