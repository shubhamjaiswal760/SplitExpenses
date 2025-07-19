const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get balances with all friends
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's friends
    const user = await User.findById(userId).populate('friends', 'username');
    const friends = user.friends;

    const balances = [];

    for (const friend of friends) {
      // Calculate balance with this friend
      const userPaidTransactions = await Transaction.find({
        payer: userId,
        receiver: friend._id
      });

      const friendPaidTransactions = await Transaction.find({
        payer: friend._id,
        receiver: userId
      });

      const userPaidTotal = userPaidTransactions.reduce((sum, t) => sum + t.amount, 0);
      const friendPaidTotal = friendPaidTransactions.reduce((sum, t) => sum + t.amount, 0);

      const balance = userPaidTotal - friendPaidTotal;

      balances.push({
        friend: {
          id: friend._id,
          username: friend.username
        },
        balance: balance, // Positive = friend owes user, Negative = user owes friend
        userPaid: userPaidTotal,
        friendPaid: friendPaidTotal
      });
    }

    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get balance with specific friend
router.get('/friend/:friendId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;

    // Calculate balance with this friend
    const userPaidTransactions = await Transaction.find({
      payer: userId,
      receiver: friendId
    });

    const friendPaidTransactions = await Transaction.find({
      payer: friendId,
      receiver: userId
    });

    const userPaidTotal = userPaidTransactions.reduce((sum, t) => sum + t.amount, 0);
    const friendPaidTotal = friendPaidTransactions.reduce((sum, t) => sum + t.amount, 0);

    const balance = userPaidTotal - friendPaidTotal;

    // Get friend info
    const friend = await User.findById(friendId, 'username');

    res.json({
      friend: {
        id: friend._id,
        username: friend.username
      },
      balance: balance,
      userPaid: userPaidTotal,
      friendPaid: friendPaidTotal
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
