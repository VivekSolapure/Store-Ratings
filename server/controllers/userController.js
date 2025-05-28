const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRatings = async (req, res) => {
  const userId = req.user.id;
  try {
    const [ratings] = await db.execute(
      'SELECT store_id, rating FROM ratings WHERE user_id = ?',
      [userId]
    );
    res.status(200).json({ ratings });
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
