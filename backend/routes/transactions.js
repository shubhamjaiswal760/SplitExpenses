const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { receiverUsername, amount, description } = req.body;
    const payerId = req.user.userId;

    // Find receiver by username
    const receiver = await User.findOne({ username: receiverUsername });
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if they are friends
    const payer = await User.findById(payerId);
    if (!payer.friends.includes(receiver._id)) {
      return res.status(400).json({ message: 'You can only add transactions with friends' });
    }

    // Create transaction
    const transaction = new Transaction({
      payer: payerId,
      receiver: receiver._id,
      amount,
      description
    });

    await transaction.save();

    // Populate the transaction for response
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('payer', 'username')
      .populate('receiver', 'username');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({
      $or: [{ payer: userId }, { receiver: userId }]
    })
    .populate('payer', 'username')
    .populate('receiver', 'username')
    .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transactions with specific friend
router.get('/friend/:friendId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;

    const transactions = await Transaction.find({
      $or: [
        { payer: userId, receiver: friendId },
        { payer: friendId, receiver: userId }
      ]
    })
    .populate('payer', 'username')
    .populate('receiver', 'username')
    .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
