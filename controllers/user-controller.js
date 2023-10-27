const { User, Thought } = require("../models");

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json(err));
  },

  // Get a single user by its _id and populate thought and friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json(err));
  },

  // Update a user by its _id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Remove a user by its _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Add a new friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
