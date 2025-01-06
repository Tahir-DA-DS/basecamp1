const User = require('../models/user');

const SessionController = {
  // Log in a user
  async signIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.validateCredentials(email, password);
      if (!user) return res.status(401).send('Invalid email or password');

      req.session.userId = user.Id; // Save user ID in the session
      res.status(200).json({message:'Logged in successfully'});
    } catch (error) {
      res.status(500).send('Error logging in');
    }
  },

  // Log out a user
  async signOut(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).send('Error logging out');
      res.status(200).send('Logged out successfully');
    });
  },
};

module.exports = SessionController;
